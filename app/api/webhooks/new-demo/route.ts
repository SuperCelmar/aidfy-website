import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mapWebhookToDemoProfileRow, slugifyCompanyId, IncomingWebhook } from '@/lib/webhook-mapper';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const webhookSecret = process.env.WEBHOOK_NEW_DEMO_SECRET;

const admin = supabaseUrl && serviceKey
  ? createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;

export async function POST(req: NextRequest) {
  if (!admin) return NextResponse.json({ message: 'Server not configured' }, { status: 500 });

  // Basic bearer secret validation
  const authz = req.headers.get('authorization') || '';
  if (!webhookSecret || authz !== `Bearer ${webhookSecret}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as IncomingWebhook;
    if (!body?.companyName) {
      return NextResponse.json({ message: 'companyName is required' }, { status: 400 });
    }

    const companyId = slugifyCompanyId(body.companyName);

    // Idempotency: if exists, return existing
    const { data: existing, error: selectErr } = await admin
      .from('demo_profiles')
      .select('company_id')
      .eq('company_id', companyId)
      .maybeSingle();

    if (selectErr) return NextResponse.json({ message: 'DB error', error: selectErr }, { status: 500 });

    if (!existing) {
      const row = mapWebhookToDemoProfileRow(body);
      const { error: insertErr } = await admin.from('demo_profiles').insert([row]);
      if (insertErr) return NextResponse.json({ message: 'Insert error', error: insertErr }, { status: 500 });
    }

    const demoUrl = `/demo/${companyId}`;
    return NextResponse.json({ ok: true, companyId, demoUrl });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Unexpected error' }, { status: 500 });
  }
}


