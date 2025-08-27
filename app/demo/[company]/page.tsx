'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { trackFunnelEvent, getOrCreateSessionId } from '@/lib/analytics';
import { splitIntoTwoLines } from '@/lib/text-utils';

type Profile = {
  companyId: string;
  companyName: string;
  logoUrl: string;
  colors: { primary: string; secondary: string; accent?: string };
  fontFamily: string;
  painPoint: string;
  convocoreAgentId?: string;
  metrics?: { rating?: number; ratingCount?: number };
  media?: { videoUrl?: string; images?: string[] };
  locale?: 'fr' | 'en';
};

interface DemoPageProps {
  params: Promise<{ company: string }>;
}

export default function DemoPage({ params }: DemoPageProps) {
  const [company, setCompany] = useState<string>('');
  useEffect(() => {
    let active = true;
    (async () => {
      const { company } = await params;
      if (active) setCompany(company);
    })();
    return () => {
      active = false;
    };
  }, [params]);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [index, setIndex] = useState(0);
  const sessionId = useMemo(() => getOrCreateSessionId(), []);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/profile/${company}`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to load profile');
        if (!isActive) return;
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, [company]);

  useEffect(() => {
    if (!profile) return;
    const root = document.documentElement.style;
    root.setProperty('--brand-primary', profile.colors.primary);
    root.setProperty('--brand-secondary', profile.colors.secondary);
    root.setProperty('--brand-accent', profile.colors.accent || '#0C0C0C');
    root.setProperty('--font-body', profile.fontFamily);
  }, [profile]);

  const onStep = async (step: string, meta?: Record<string, any>) => {
    if (!profile) return;
    await trackFunnelEvent({ companyId: profile.companyId, step, ts: Date.now(), sessionId, meta });
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ fontFamily: 'var(--font-body)' }}>
      <nav className="flex items-center justify-between px-4 py-3 border-b" style={{ background: 'var(--brand-secondary)' }}>
        <div className="flex items-center gap-3">
          {profile.logoUrl ? (
            <img src={profile.logoUrl} alt={`${profile.companyName} logo`} className="h-8 w-auto" />
          ) : null}
          <span className="font-semibold" style={{ color: 'var(--brand-accent)' }}>{profile.companyName} Demo</span>
        </div>
        <Link href="/book-demo" className="px-3 py-1 rounded text-white" style={{ background: 'var(--brand-primary)' }}>
          Réserver
        </Link>
      </nav>

      <div className="w-full py-8">
        <div className="mx-auto grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
          <div className="pl-2">
            <button
              aria-label="Précédent"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="px-2 py-2 rounded-r bg-black/30 text-white hover:bg-black/50"
              style={{ pointerEvents: index > 0 ? 'auto' : 'none', opacity: index > 0 ? 1 : 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M15.78 3.72a.75.75 0 0 1 0 1.06L9.56 11l6.22 6.22a.75.75 0 1 1-1.06 1.06l-6.75-6.75a.75.75 0 0 1 0-1.06l6.75-6.75a.75.75 0 0 1 1.06 0z" clipRule="evenodd"/></svg>
            </button>
          </div>

          <div className="max-w-5xl mx-auto px-4">
            {index === 0 && <SlideIntro profile={profile} onNext={async () => { await onStep('intro_clicked'); setIndex(1); }} onPrev={() => setIndex(0)} />}
            {index === 1 && <SlideLanding profile={profile} onNext={() => setIndex(2)} onPrev={() => setIndex(0)} />}
            {index === 2 && <SlideProblem profile={profile} onNext={() => setIndex(3)} onPrev={() => setIndex(1)} />}
            {index === 3 && <SlideSolution profile={profile} onNext={async () => { await onStep('solution'); setIndex(4); }} onPrev={() => setIndex(2)} />}
            {index === 4 && <SlideRoi profile={profile} onNext={async () => { await onStep('roi_submitted'); setIndex(5); }} onPrev={() => setIndex(3)} />}
            {index === 5 && <SlideChatCta profile={profile} onNext={() => setIndex(5)} onPrev={() => setIndex(4)} />}
          </div>

          <div className="pr-2 text-right">
            <button
              aria-label="Suivant"
              onClick={() => setIndex((i) => Math.min(5, i + 1))}
              className="px-2 py-2 rounded-l bg-black/30 text-white hover:bg-black/50"
              style={{ pointerEvents: index < 5 ? 'auto' : 'none', opacity: index < 5 ? 1 : 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M8.22 20.28a.75.75 0 0 1 0-1.06L14.44 13 8.22 6.78a.75.75 0 0 1 1.06-1.06l6.75 6.75a.75.75 0 0 1 0 1.06l-6.75 6.75a.75.75 0 0 1-1.06 0z" clipRule="evenodd"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideIntro({ profile, onNext, onPrev }: { profile: Profile; onNext: () => void; onPrev: () => void }) {
  const videoUrl = profile.media?.videoUrl || 'https://www.loom.com/embed/d2f9bede23a14e46b15b3bfe888a1daa';
  return (
    <section onClick={onNext} className="min-h-[70vh] grid md:grid-cols-2 gap-6 items-center cursor-pointer select-none">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--brand-accent)' }}>
          {profile.companyName} × AutomationDFY
        </h1>
        <p className="text-gray-700">
          Démarrage rapide de la démonstration personnalisée.
        </p>
      </div>
      <div className="relative">
        <iframe className="w-full aspect-video rounded" src={videoUrl} allowFullScreen />
        {profile.logoUrl ? (
          <img src={profile.logoUrl} alt="logo" className="absolute top-2 right-2 h-8 w-auto opacity-80" />
        ) : null}
      </div>
    </section>
  );
}

function SlideLanding({ profile, onNext, onPrev }: { profile: Profile; onNext: () => void; onPrev: () => void }) {
  return (
    <section
      onClick={onNext}
      className="rounded-xl p-8 grid place-items-center min-h-[70vh] cursor-pointer select-none"
      style={{ background: `linear-gradient(135deg, var(--brand-secondary), ${shade(profile.colors.primary, 0.15)})` }}
    >
      <h2
        className="font-extrabold text-center"
        style={{
          fontFamily: 'var(--font-body)',
          color: '#ffffff',
          lineHeight: 1.05,
          fontSize: 'clamp(2.5rem, 8vw, 8rem)'
        }}
      >
        {profile.companyName}
      </h2>
    </section>
  );
}

function SlideProblem({ profile, onNext, onPrev }: { profile: Profile; onNext: () => void; onPrev: () => void }) {
  const [first, second] = splitIntoTwoLines(profile.painPoint || '');
  return (
    <section onClick={onNext} className="min-h-[70vh] grid place-items-center rounded-xl p-8 cursor-pointer select-none" style={{ background: 'var(--brand-secondary)' }}>
      <div className="text-center" style={{ fontFamily: 'var(--font-body)' }}>
        <div
          className="font-extrabold"
          style={{ color: 'var(--brand-accent)', lineHeight: 1.1, fontSize: 'clamp(1rem, 2.75vw, 2.5rem)' }}
        >
          {first}
        </div>
        <div
          className="font-extrabold"
          style={{ color: 'var(--brand-primary)', lineHeight: 1.1, fontSize: 'clamp(1rem, 2.75vw, 2.5rem)' }}
        >
          {second}
        </div>
      </div>
    </section>
  );
}

function SlideSolution({ profile, onNext, onPrev }: { profile: Profile; onNext: () => void; onPrev: () => void }) {
  return (
    <section onClick={onNext} className="space-y-4 cursor-pointer select-none">
      <h3 className="text-2xl font-semibold" style={{ color: 'var(--brand-accent)' }}>
        Répondre aussi vite que possible lorsque le client est en mode 'achat'
      </h3>
      <div className="rounded overflow-hidden border" style={{ borderColor: 'var(--brand-primary)' }}>
        <img
          src="/Lead%20Funnel.png"
          alt="Lead funnel"
          className="w-full h-auto"
        />
      </div>
      
    </section>
  );
}

function SlideRoi({ profile, onNext, onPrev }: { profile: Profile; onNext: () => void; onPrev: () => void }) {
  return (
    <section onClick={onNext} className="space-y-6 cursor-pointer select-none">
      <h3 className="text-2xl font-semibold" style={{ color: 'var(--brand-accent)' }}>
        Architecture de la solution
      </h3>
      <div className="rounded overflow-hidden border" style={{ borderColor: 'var(--brand-primary)' }}>
        <img
          src="/infra_breakdown.png"
          alt="Architecture breakdown"
          className="w-full h-auto"
        />
      </div>
      
    </section>
  );
}

function SlideChatCta({ profile, onNext, onPrev }: { profile: Profile; onNext: () => void; onPrev: () => void }) {
  useEffect(() => {
    if (!profile.convocoreAgentId) return;
    const w = window as any;
    // If agent changed, reload script with new config
    if (w.__vg_agent_id !== profile.convocoreAgentId) {
      w.VG_CONFIG = {
        ID: profile.convocoreAgentId,
        region: 'eu',
        render: 'full-width',
        stylesheets: ['https://vg-bunny-cdn.b-cdn.net/vg_live_build/styles.css'],
      };
      const existing = document.querySelector('script[src*="vg_bundle.js"]') as HTMLScriptElement | null;
      if (existing) existing.remove();
      const s = document.createElement('script');
      s.src = 'https://vg-bunny-cdn.b-cdn.net/vg_live_build/vg_bundle.js';
      s.defer = true;
      s.onload = () => { w.__vg_agent_id = profile.convocoreAgentId; };
      document.body.appendChild(s);
    }
  }, [profile.convocoreAgentId]);

  return (
    <section onClick={onNext} className="space-y-6 cursor-pointer select-none">
      <h3 className="text-2xl font-semibold" style={{ color: 'var(--brand-accent)' }}>
        Passons à l’action
      </h3>
      {profile.convocoreAgentId ? (
        <div className="rounded p-4 border" style={{ borderColor: 'var(--brand-primary)' }}>
          <div style={{ width: '100%', height: 500 }} id="VG_OVERLAY_CONTAINER" onClick={(e) => e.stopPropagation()} />
        </div>
      ) : (
        <p className="text-gray-700">
          Le widget n’est pas configuré pour cette démo.
        </p>
      )}
      
    </section>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-6 rounded-lg text-center" style={{ background: 'var(--brand-secondary)' }}>
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-bold" style={{ color: 'var(--brand-accent)' }}>{value}</div>
    </div>
  );
}

function shade(hex: string, amount: number): string {
  const c = hex.replace('#', '');
  const num = parseInt(c, 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) * (1 - amount)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) * (1 - amount)));
  const b = Math.min(255, Math.max(0, (num & 0xff) * (1 - amount)));
  return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`;
}

