export type CompanyProfile = {
  companyId: string;
  companyName: string;
  logoUrl: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  fontFamily: string;
  painPoint: string;
  convocoreAgentId?: string;
  metrics: {
    rating?: number;
    ratingCount?: number;
    chlorineReductionNote?: string;
  };
  media?: {
    videoUrl?: string;
    images?: string[];
  };
  locale?: 'fr' | 'en';
  flags?: {
    enableTestimonials?: boolean;
    enableFaq?: boolean;
    enableComparison?: boolean;
    enableDarkMode?: boolean;
  };
};

export function normalizeProfile(input: Partial<CompanyProfile> & { companyId: string }): CompanyProfile {
  const companyName = input.companyName || input.companyId;

  return {
    companyId: input.companyId,
    companyName,
    logoUrl: input.logoUrl || '',
    colors: {
      primary: input.colors?.primary || '#111111',
      secondary: input.colors?.secondary || '#f5f5f5',
      accent: input.colors?.accent || '#0c0c0c',
    },
    fontFamily: input.fontFamily || 'Inter, sans-serif',
    painPoint: input.painPoint || '',
    convocoreAgentId: input.convocoreAgentId,
    metrics: {
      rating: input.metrics?.rating,
      ratingCount: input.metrics?.ratingCount,
      chlorineReductionNote: input.metrics?.chlorineReductionNote,
    },
    media: input.media || {},
    locale: input.locale || 'fr',
    flags: input.flags || {},
  };
}


