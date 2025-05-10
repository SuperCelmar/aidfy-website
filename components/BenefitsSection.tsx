'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Placeholder Icons (simple SVGs)
const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 1.083A9.375 9.375 0 001.563 6.5v4.313c0 4.834 3.306 8.907 8.017 10.034a.75.75 0 00.84 0c4.71-1.127 8.017-5.2 8.017-10.034V6.5A9.375 9.375 0 0010 1.083zM9.25 12.415l-2.72-2.72a.75.75 0 011.06-1.06l1.69 1.69 3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0z" clipRule="evenodd" />
  </svg>
);

const ChartUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M14.5 2.5a.75.75 0 00-1.5 0v9.566l-2.22-2.22a.75.75 0 00-1.06 1.06l3.5 3.5a.75.75 0 001.06 0l3.5-3.5a.75.75 0 00-1.06-1.06L14.5 12.066V2.5z" />
    <path fillRule="evenodd" d="M2.225 12.043a.75.75 0 01.012-1.06l2.25-2.25a.75.75 0 011.06 0l2.25 2.25a.75.75 0 01.013 1.06l-2.25 2.25a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 01-.012-1.061zM10 7.793a.75.75 0 01.013-1.06l2.25-2.25a.75.75 0 011.06 0l2.25 2.25a.75.75 0 01.013 1.06l-2.25 2.25a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 01-.012-1.061z" clipRule="evenodd" />
    <path d="M3.5 16.25a.75.75 0 000 1.5h13a.75.75 0 000-1.5h-13z" />
  </svg>
);

const ChatBubblesIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M7.012 3.96a9.221 9.221 0 00-4.215 2.339c-1.242 1.316-1.8 3.032-1.8 4.701 0 1.67.558 3.385 1.8 4.701l.006.006c1.16 1.232 2.706 1.932 4.346 2.081a.75.75 0 00.361-1.442 7.723 7.723 0 01-3.674-1.744l-.007-.008c-.91-.967-1.387-2.228-1.387-3.594s.477-2.627 1.387-3.594l.006-.007a7.702 7.702 0 013.587-1.665.75.75 0 00.296-1.468zM16.5 6.25a.75.75 0 00-1.5 0v.137A5.002 5.002 0 0011 5.003c-2.76 0-5 2.24-5 5.001 0 1.924 1.09 3.603 2.704 4.434l-.513.855a.75.75 0 001.218.732l.796-.477a6.52 6.52 0 003.795 0l.796.477a.75.75 0 101.218-.732l-.513-.855A4.982 4.982 0 0016.5 10.004c0-1.445-.623-2.746-1.636-3.679V6.25zM15 10.004c0 2.208-1.792 4.001-4 4.001s-4-1.793-4-4.001c0-2.207 1.792-4 4-4s4 1.793 4 4z" clipRule="evenodd" />
  </svg>
);


interface Benefit {
  id: string;
  icon: React.ElementType;
  headline: string;
  metric: string;
  subtext: string;
}

const defaultBenefits: Benefit[] = [
  {
    id: 'refund-cut',
    icon: ShieldIcon,
    headline: 'Refund rate cut in half',
    metric: 'Response time → 3 days → 10 minutes',
    subtext: 'Edible Arrangements saw happier customers—and fewer complaints.',
  },
  {
    id: 'conversion-lift',
    icon: ChartUpIcon,
    headline: '+20 % Conversion Lift',
    metric: '100 % missed calls answered',
    subtext: 'Our system turns every inquiry into an opportunity.',
  },
  {
    id: 'friction-gone',
    icon: ChatBubblesIcon,
    headline: 'Internal friction gone',
    metric: 'Weeks → Days',
    subtext: 'Franchisees collaborate faster, roll out updates in record time.',
  },
];

interface BenefitsSectionProps {
  benefits?: Benefit[];
  title?: string;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  benefits = defaultBenefits,
  title = "Why Our Partners Love It",
}) => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            const headlineId = `${benefit.id}-headline`;
            return (
              <motion.article
                key={benefit.id}
                aria-labelledby={headlineId}
                className="bg-gray-200 p-6 rounded-xl shadow-lg hover:shadow-2xl focus-within:ring-2 focus-within:ring-slate-700 focus-within:ring-offset-2 focus-within:ring-offset-gray-200 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <IconComponent className="w-12 h-12 text-slate-700 mb-6" />
                <h3 id={headlineId} className="text-2xl font-bold text-gray-900 mb-3">
                  {benefit.headline}
                </h3>
                <p className="text-[32px] leading-tight text-slate-700 font-semibold mb-4">
                  {benefit.metric}
                </p>
                <p className="text-base text-gray-700">
                  {benefit.subtext}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection; 