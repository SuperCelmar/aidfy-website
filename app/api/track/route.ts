import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const admin = supabaseUrl && serviceKey
  ? createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;

export async function POST(req: NextRequest) {
  if (!admin) {
    return NextResponse.json({ message: 'Server not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { companyId, step, ts, sessionId, meta } = body || {};

    if (!companyId || !step || !ts) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const payload = {
      company_id: companyId,
      step,
      ts: new Date(ts).toISOString(),
      session_id: sessionId || null,
      meta: meta || {},
    };

    const { error } = await admin.from('funnel_events').insert([payload]);
    if (error) return NextResponse.json({ message: 'Insert error', error }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Unexpected error' }, { status: 500 });
  }
}


