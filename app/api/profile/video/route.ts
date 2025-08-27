import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = supabaseUrl && serviceKey
  ? createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;

export async function POST(req: NextRequest) {
  if (!admin) return NextResponse.json({ message: 'Server not configured' }, { status: 500 });

  const authz = req.headers.get('authorization') || '';
  const secret = process.env.WEBHOOK_NEW_DEMO_SECRET;
  if (!secret || authz !== `Bearer ${secret}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { companyId, videoUrl } = await req.json();
    if (!companyId || typeof videoUrl !== 'string') {
      return NextResponse.json({ message: 'companyId and videoUrl are required' }, { status: 400 });
    }

    const { data: updated, error: updErr } = await admin
      .from('demo_profiles')
      .update({ media: { videoUrl } })
      .eq('company_id', companyId)
      .select('company_id');

    if (updErr) return NextResponse.json({ message: 'Update error', error: updErr }, { status: 500 });

    if (!updated || updated.length === 0) {
      // Upsert minimal row if missing
      const { error: insErr } = await admin
        .from('demo_profiles')
        .insert([{ company_id: companyId, company_name: companyId, media: { videoUrl } }]);
      if (insErr) return NextResponse.json({ message: 'Insert error', error: insErr }, { status: 500 });
      return NextResponse.json({ ok: true, companyId, videoUrl, created: true });
    }

    return NextResponse.json({ ok: true, companyId, videoUrl, updated: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Unexpected error' }, { status: 500 });
  }
}


