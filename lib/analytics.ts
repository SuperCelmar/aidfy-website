type FunnelEvent = {
  companyId: string;
  step: string;
  ts: number;
  sessionId?: string;
  meta?: Record<string, any>;
};

const SESSION_KEY = 'funnel_session_id';

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = cryptoRandomId();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function trackFunnelEvent(event: FunnelEvent): Promise<void> {
  const sessionId = getOrCreateSessionId() || event.sessionId;
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...event, sessionId }),
      keepalive: true,
    });
  } catch (err) {
    console.error('trackFunnelEvent failed', err);
  }
}

function cryptoRandomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}


