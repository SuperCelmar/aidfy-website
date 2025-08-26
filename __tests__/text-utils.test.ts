import { describe, it, expect } from 'vitest';
import { splitIntoTwoLines } from '../lib/text-utils';

describe('splitIntoTwoLines', () => {
  it('splits around the middle on whitespace', () => {
    const [a, b] = splitIntoTwoLines('Bonjour le monde merveilleux');
    expect(a.length > 0 && b.length > 0).toBe(true);
  });

  it('handles no whitespace', () => {
    const [a, b] = splitIntoTwoLines('Supercalifragilisticexpialidocious');
    expect(a.length > 0 && b.length > 0).toBe(true);
  });
});


