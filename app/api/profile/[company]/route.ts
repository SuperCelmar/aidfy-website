import { NextResponse } from 'next/server';
import { createFreshSupabaseClient } from '@/lib/supabase-fresh';
import { normalizeProfile } from '@/lib/profile';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;

  // 1) Try local file under profiles/company.json for fast iteration
  try {
    const localPath = path.join(process.cwd(), 'profiles', `${company}.json`);
    const raw = await readFile(localPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return NextResponse.json(normalizeProfile(parsed));
  } catch (_err) {
    // ignore, fall back to Supabase
  }

  // 2) Fallback to Supabase table demo_profiles (company_id PK)
  try {
    const supabase = createFreshSupabaseClient();
    if (!supabase) return NextResponse.json({ message: 'Supabase not configured' }, { status: 500 });

    const { data, error } = await supabase
      .from('demo_profiles')
      .select('*')
      .eq('company_id', company)
      .maybeSingle();

    if (error) return NextResponse.json({ message: 'DB error', error }, { status: 500 });
    if (!data) return NextResponse.json({ message: 'Profile not found' }, { status: 404 });

    // Map DB row to profile shape if needed
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


