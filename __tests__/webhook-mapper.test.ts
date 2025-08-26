import { describe, it, expect } from 'vitest';
import { mapWebhookToDemoProfileRow, slugifyCompanyId } from '../lib/webhook-mapper';

describe('slugifyCompanyId', () => {
  it('creates a kebab-case slug', () => {
    expect(slugifyCompanyId('Seoni Paris')).toBe('seoni-paris');
    expect(slugifyCompanyId('  SEONI  ')).toBe('seoni');
  });
});

describe('mapWebhookToDemoProfileRow', () => {
  it('maps fields correctly', () => {
    const row = mapWebhookToDemoProfileRow({
      companyName: 'Seoni',
      logoUrl: 'https://example.com/logo.svg',
      color_primary: '#000000',
      color_secondary: '#ffffff',
      color_accent: '#ff0000',
      fontFamily: 'Inter, sans-serif',
      locale: 'fr',
      painPoint: 'Hard water',
    });

    expect(row.company_id).toBe('seoni');
    expect(row.colors?.primary).toBe('#000000');
    expect(row.colors?.secondary).toBe('#ffffff');
    expect(row.colors?.accent).toBe('#ff0000');
    expect(row.font_family).toContain('Inter');
    expect(row.locale).toBe('fr');
    expect(row.pain_point).toBe('Hard water');
  });
});


