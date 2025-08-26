'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { trackFunnelEvent, getOrCreateSessionId } from '@/lib/analytics';
import { calculateRoi } from '@/lib/roi';
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
  params: { company: string };
}

export default function DemoPage({ params }: DemoPageProps) {
  const { company } = params;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [index, setIndex] = useState(0);
  const sessionId = useMemo(() => getOrCreateSessionId(), []);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/profile/${company}`);
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

      <div className="max-w-5xl mx-auto px-4 py-8">
        {index === 0 && <SlideIntro profile={profile} onNext={async () => { await onStep('intro_clicked'); setIndex(1); }} />}
        {index === 1 && <SlideLanding profile={profile} onNext={() => setIndex(2)} />}
        {index === 2 && <SlideProblem profile={profile} onNext={() => setIndex(3)} />}
        {index === 3 && <SlideSolution profile={profile} onNext={async () => { await onStep('solution'); setIndex(4); }} />}
        {index === 4 && <SlideRoi profile={profile} onNext={async () => { await onStep('roi_submitted'); setIndex(5); }} />}
        {index === 5 && <SlideChatCta profile={profile} onCta={async () => { await onStep('cta_clicked'); }} />}
      </div>
    </div>
  );
}

function SlideIntro({ profile, onNext }: { profile: Profile; onNext: () => void }) {
  const videoUrl = profile.media?.videoUrl || 'https://www.loom.com/embed/d2f9bede23a14e46b15b3bfe888a1daa';
  return (
    <section className="min-h-[70vh] grid md:grid-cols-2 gap-6 items-center">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--brand-accent)' }}>
          {profile.companyName} × AutomationDFY
        </h1>
        <p className="text-gray-700">
          Démarrage rapide de la démonstration personnalisée.
        </p>
        <button onClick={onNext} className="px-4 py-2 rounded text-white" style={{ background: 'var(--brand-primary)' }}>
          Commencer la démo
        </button>
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

function SlideLanding({ profile, onNext }: { profile: Profile; onNext: () => void }) {
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

function SlideProblem({ profile, onNext }: { profile: Profile; onNext: () => void }) {
  const [first, second] = splitIntoTwoLines(profile.painPoint || '');
  return (
    <section onClick={onNext} className="min-h-[70vh] grid place-items-center rounded-xl p-8 cursor-pointer select-none" style={{ background: 'var(--brand-secondary)' }}>
      <div className="text-center" style={{ fontFamily: 'var(--font-body)' }}>
        <div
          className="font-extrabold"
          style={{ color: 'var(--brand-accent)', lineHeight: 1.1, fontSize: 'clamp(2rem, 5.5vw, 5rem)' }}
        >
          {first}
        </div>
        <div
          className="font-extrabold"
          style={{ color: 'var(--brand-primary)', lineHeight: 1.1, fontSize: 'clamp(2rem, 5.5vw, 5rem)' }}
        >
          {second}
        </div>
      </div>
    </section>
  );
}

function SlideSolution({ profile, onNext }: { profile: Profile; onNext: () => void }) {
  const bullets = [
    'IVR Twilio avec routage round-robin',
    'SMS automatique en cas d’appel manqué',
    'Agent vocal IA pour qualifier et réserver',
    'Intégration calendrier et tableau de bord',
  ];
  return (
    <section className="space-y-4">
      <h3 className="text-2xl font-semibold" style={{ color: 'var(--brand-accent)' }}>
        Système de réponse en 60 secondes
      </h3>
      <p className="text-gray-700">
        Chaque nouveau lead reçoit un appel + SMS en moins d’une minute. L’agent IA qualifie et réserve.
      </p>
      <ul className="grid md:grid-cols-2 gap-3">
        {bullets.map((b) => (
          <li key={b} className="p-4 rounded text-white" style={{ background: 'var(--brand-primary)' }}>{b}</li>
        ))}
      </ul>
      <div>
        <button onClick={onNext} className="px-4 py-2 rounded text-white" style={{ background: 'var(--brand-primary)' }}>
          Voir le ROI
        </button>
      </div>
    </section>
  );
}

function SlideRoi({ profile, onNext }: { profile: Profile; onNext: () => void }) {
  const [leads, setLeads] = useState(1000);
  const [aov, setAov] = useState(60);
  const baseline = 0.05; // 5%
  const fast = 0.3; // 30%
  const roi = calculateRoi({ monthlyLeads: leads, averageOrderValue: aov, baselineConversionRate: baseline, fastResponseConversionRate: fast });

  return (
    <section className="space-y-6">
      <h3 className="text-2xl font-semibold" style={{ color: 'var(--brand-accent)' }}>
        Impact sur les commandes et le CA
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded border">
          <label className="text-sm text-gray-600">Leads mensuels</label>
          <input type="number" value={leads} onChange={(e) => setLeads(Number(e.target.value))} className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div className="p-4 rounded border">
          <label className="text-sm text-gray-600">Panier moyen (€)</label>
          <input type="number" value={aov} onChange={(e) => setAov(Number(e.target.value))} className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div className="p-4 rounded border flex flex-col justify-center">
          <div className="text-sm text-gray-600">Conversion 60s vs 24h</div>
          <div className="font-semibold">30% vs 5%</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Stat title="Commandes actuelles" value={roi.baselineOrders.toFixed(0)} />
        <Stat title="Commandes 60s" value={roi.fastResponseOrders.toFixed(0)} />
        <Stat title="CA incrémental" value={`${roi.incrementalRevenue.toFixed(0)} €`} />
      </div>

      <div>
        <button onClick={onNext} className="px-4 py-2 rounded text-white" style={{ background: 'var(--brand-primary)' }}>
          Passer au chat
        </button>
      </div>
    </section>
  );
}

function SlideChatCta({ profile, onCta }: { profile: Profile; onCta: () => void }) {
  return (
    <section className="space-y-6">
      <h3 className="text-2xl font-semibold" style={{ color: 'var(--brand-accent)' }}>
        Passons à l’action
      </h3>
      {profile.convocoreAgentId ? (
        <div className="rounded p-4 border" style={{ borderColor: 'var(--brand-primary)' }}>
          <div style={{ width: '100%', height: 500 }} id="VG_OVERLAY_CONTAINER" />
          <script dangerouslySetInnerHTML={{ __html: `
            (function(){
              window.VG_CONFIG = {
                ID: '${profile.convocoreAgentId}',
                region: 'eu',
                render: 'full-width',
                stylesheets: ["https://vg-bunny-cdn.b-cdn.net/vg_live_build/styles.css"]
              };
              var s=document.createElement('script');
              s.src='https://vg-bunny-cdn.b-cdn.net/vg_live_build/vg_bundle.js';
              s.defer=true;document.body.appendChild(s);
            })();
          ` }} />
        </div>
      ) : (
        <p className="text-gray-700">
          Le widget n’est pas configuré pour cette démo.
        </p>
      )}
      <div className="flex gap-3">
        <Link href="/book-demo" onClick={onCta} className="px-4 py-2 rounded text-white" style={{ background: 'var(--brand-primary)' }}>
          Réservez votre atelier
        </Link>
        <a href="https://cal.com" className="px-4 py-2 rounded border" style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-accent)' }}>
          Voir le calendrier
        </a>
      </div>
      <p className="text-sm text-gray-600">
        Garantie: sous 60s de réponse en 30 jours, sinon le prochain cycle n’est pas dû.
      </p>
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

