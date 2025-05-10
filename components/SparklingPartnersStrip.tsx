'use client';

import React from 'react';
import { Sparkles } from '@/components/ui/sparkles';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';

// Placeholder Partner Logo Components (replace with your actual SVGs or Images)
const TogosLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={className} fill="currentColor">
    <text x="50" y="25" fontSize="12" textAnchor="middle" dominantBaseline="middle">Togo's</text>
  </svg>
);
const EdibleLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={className} fill="currentColor">
    <text x="50" y="25" fontSize="10" textAnchor="middle" dominantBaseline="middle">EDIBLE</text>
  </svg>
);
const FranServeLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={className} fill="currentColor">
    <text x="50" y="25" fontSize="10" textAnchor="middle" dominantBaseline="middle">FranServe</text>
  </svg>
);
const PegnatoLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={className} fill="currentColor">
    <text x="50" y="25" fontSize="8" textAnchor="middle" dominantBaseline="middle">Pegnato Intel</text>
  </svg>
);

const partners = [
  {
    id: "togo",
    name: "Togo's Eateries",
    component: TogosLogo,
    className: "w-28 md:w-32 text-gray-600 hover:text-slate-700 transition-colors duration-300",
    status: "Pilot partner"
  },
  {
    id: "edible",
    name: "Edible Arrangements",
    component: EdibleLogo,
    className: "w-28 md:w-32 text-gray-600 hover:text-slate-700 transition-colors duration-300",
    status: "Pilot partner"
  },
  {
    id: "franserve",
    name: "FranServe",
    component: FranServeLogo,
    className: "w-28 md:w-32 text-gray-600 hover:text-slate-700 transition-colors duration-300",
    status: "Pilot partner"
  },
  {
    id: "pegnato",
    name: "Pegnato Intelligence Network",
    component: PegnatoLogo,
    className: "w-28 md:w-32 text-gray-600 hover:text-slate-700 transition-colors duration-300",
    status: "Pilot partner"
  },
];

interface SparklingPartnersStripProps {
  title?: string;
}

export function SparklingPartnersStrip({ title = "Proof-of-Concept Partners" }: SparklingPartnersStripProps) {
  // For Sparkles color, using your brand's primary blue
  const sparklesColor = "#334155"; // Updated to dark blueish grey

  return (
    <section className="relative py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 md:mb-16">
          {title}
        </h2>

        <div className="relative h-20 md:h-24 w-full">
          <InfiniteSlider 
            className='flex h-full w-full items-center' 
            duration={40} // Adjusted duration for potentially fewer items
            gap={60} // Adjusted gap
            itemClassName='flex justify-center items-center' // Ensure logos are centered if they have varying widths
          >
            {partners.map(({ id, name, component: Logo, className: logoClassName, status }) => (
              <figure 
                key={id} 
                aria-labelledby={`${id}-caption`} 
                className={logoClassName}
              >
                <Logo />
                <figcaption id={`${id}-caption`} className="sr-only">
                  {name} - {status}
                </figcaption>
              </figure>
            ))}
          </InfiniteSlider>
          <ProgressiveBlur
            className='pointer-events-none absolute top-0 left-0 h-full w-[100px] md:w-[200px]'
            direction='left'
            blurIntensity={1}
          />
          <ProgressiveBlur
            className='pointer-events-none absolute top-0 right-0 h-full w-[100px] md:w-[200px]'
            direction='right'
            blurIntensity={1}
          />
        </div>
      </div>

      {/* Sparkles background effect */}
      <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]">
        <Sparkles
          density={1000}
          size={0.8}
          minSize={0.3}
          speed={0.5}
          opacity={0.7}
          color={sparklesColor}
          className="absolute inset-x-0 bottom-0 h-full w-full"
        />
      </div>
       {/* Optional: Subtle gradient background from demo, adjusted for a lighter feel - REMOVED TO PREVENT DOUBLE BLUR */}
    </section>
  );
} 