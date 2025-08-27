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
    const { companyId, convocoreAgentId } = await req.json();
    if (!companyId || !convocoreAgentId) {
      return NextResponse.json({ message: 'companyId and convocoreAgentId are required' }, { status: 400 });
    }

    const { error } = await admin
      .from('demo_profiles')
      .update({ convocore_agent_id: convocoreAgentId })
      .eq('company_id', companyId);

    if (error) return NextResponse.json({ message: 'Update error', error }, { status: 500 });

    return NextResponse.json({ ok: true, companyId });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Unexpected error' }, { status: 500 });
  }
}


