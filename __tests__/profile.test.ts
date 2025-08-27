import { describe, it, expect } from 'vitest';
import { normalizeProfile } from '../lib/profile';

describe('normalizeProfile', () => {
  it('fills defaults and preserves provided values', () => {
    const res = normalizeProfile({
      companyId: 'getseoni',
      companyName: 'Seoni',
      logoUrl: 'https://getseoni.com/logo.svg',
      colors: { primary: '#52433A', secondary: '#EDE9E6', accent: '#0C0C0C' },
      fontFamily: "Inter, sans-serif",
      painPoint: 'Hard water damages hair and skin',
      metrics: { rating: 4.8, ratingCount: 211 },
      media: { videoUrl: 'https://loom.test/video' },
      locale: 'fr',
      flags: { enableTestimonials: true },
    });

    expect(res.companyId).toBe('getseoni');
    expect(res.companyName).toBe('Seoni');
    expect(res.colors.primary).toBe('#52433A');
    expect(res.fontFamily).toContain('Inter');
    expect(res.metrics.rating).toBe(4.8);
    expect(res.locale).toBe('fr');
  });

  it('applies defaults when fields missing', () => {
    const res = normalizeProfile({ companyId: 'acme' });
    expect(res.companyName).toBe('acme');
    expect(res.colors.primary).toBe('#111111');
    expect(res.fontFamily).toContain('Inter');
  });
});


