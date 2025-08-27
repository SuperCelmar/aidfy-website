export type IncomingWebhook = {
  painPoint?: string;
  companyName: string;
  logoUrl?: string;
  color_primary?: string;
  color_secondary?: string;
  color_accent?: string;
  fontFamily?: string;
  locale?: 'fr' | 'en';
  videoUrl?: string | null;
  convocoreAgentId?: string | null;
};

export type DemoProfilesRow = {
  company_id: string;
  company_name: string;
  logo_url?: string | null;
  colors?: { primary?: string; secondary?: string; accent?: string } | null;
  font_family?: string | null;
  pain_point?: string | null;
  metrics?: Record<string, any> | null;
  media?: { videoUrl?: string | null } | null;
  locale?: 'fr' | 'en' | null;
  flags?: Record<string, any> | null;
  cta?: { label?: string; href?: string } | null;
};

export function slugifyCompanyId(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function mapWebhookToDemoProfileRow(payload: IncomingWebhook): DemoProfilesRow {
  const companyId = slugifyCompanyId(payload.companyName);
  const colors = {
    primary: payload.color_primary || undefined,
    secondary: payload.color_secondary || undefined,
    accent: payload.color_accent || undefined,
  };

  const media = {
    videoUrl: payload.videoUrl ?? null,
  };

  const row: DemoProfilesRow = {
    company_id: companyId,
    company_name: payload.companyName,
    logo_url: payload.logoUrl || null,
    colors,
    font_family: payload.fontFamily || 'Inter, sans-serif',
    pain_point: payload.painPoint || null,
    metrics: {},
    media,
    locale: payload.locale || 'fr',
    flags: {},
    cta: null,
  };

  return row;
}


