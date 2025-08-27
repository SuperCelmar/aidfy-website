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

    const { data: existing, error: selErr } = await admin
      .from('demo_profiles')
      .select('media')
      .eq('company_id', companyId)
      .maybeSingle();

    if (selErr) return NextResponse.json({ message: 'DB error', error: selErr }, { status: 500 });
    if (!existing) return NextResponse.json({ message: 'Profile not found' }, { status: 404 });

    const currentMedia = (existing as any).media || {};
    const merged = { ...currentMedia, videoUrl };

    const { error: updErr } = await admin
      .from('demo_profiles')
      .update({ media: merged })
      .eq('company_id', companyId);

    if (updErr) return NextResponse.json({ message: 'Update error', error: updErr }, { status: 500 });

    return NextResponse.json({ ok: true, companyId, videoUrl });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Unexpected error' }, { status: 500 });
  }
}


