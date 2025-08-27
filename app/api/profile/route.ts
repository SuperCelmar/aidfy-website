import { NextResponse } from 'next/server';
import { createFreshSupabaseClient } from '@/lib/supabase-fresh';
import { normalizeProfile } from '@/lib/profile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const company = url.searchParams.get('company');
    if (!company) {
      return NextResponse.json({ message: 'company is required' }, { status: 400 });
    }

    const supabase = createFreshSupabaseClient();
    if (!supabase) return NextResponse.json({ message: 'Supabase not configured' }, { status: 500 });

    const { data, error } = await supabase
      .from('demo_profiles')
      .select('*')
      .eq('company_id', company)
      .maybeSingle();

    if (error) return NextResponse.json({ message: 'DB error', error }, { status: 500 });
    if (!data) return NextResponse.json({ message: 'Profile not found' }, { status: 404 });

    const mapped = {
      companyId: data.company_id,
      companyName: data.company_name ?? data.company_id,
      logoUrl: data.logo_url ?? '',
      colors: data.colors ?? {},
      fontFamily: data.font_family ?? 'Inter, sans-serif',
      painPoint: data.pain_point ?? '',
      convocoreAgentId: data.convocore_agent_id ?? undefined,
      metrics: data.metrics ?? {},
      media: data.media ?? {},
      locale: data.locale ?? 'fr',
      flags: data.flags ?? {},
    };

    return NextResponse.json(normalizeProfile(mapped));
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Unexpected error' }, { status: 500 });
  }
}


