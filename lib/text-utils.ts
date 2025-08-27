export function splitIntoTwoLines(text: string): [string, string] {
  const normalized = (text || '').trim().replace(/\s+/g, ' ');
  if (normalized.length === 0) return ['', ''];

  const mid = Math.floor(normalized.length / 2);
  // Find nearest whitespace around the midpoint
  let splitIdx = -1;
  for (let i = mid; i < normalized.length; i++) {
    if (normalized[i] === ' ') { splitIdx = i; break; }
  }
  if (splitIdx === -1) {
    for (let i = mid; i >= 0; i--) {
      if (normalized[i] === ' ') { splitIdx = i; break; }
    }
  }
  if (splitIdx === -1) {
    // No space found; hard split
    splitIdx = mid;
  }

  const first = normalized.slice(0, splitIdx).trim();
  const second = normalized.slice(splitIdx + 1).trim();
  return [first, second];
}


