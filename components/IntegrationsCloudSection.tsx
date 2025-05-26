'use client'; // IconCloud uses useTheme, so this section using it might also need to be client if it had hooks, but for now, it's mostly passthrough.
// However, since IconCloud is client, and this wraps it directly, it's safer to mark it client too or ensure no client-only props are passed if it were server.
// For simplicity and because IconCloud is the main feature, marking client is fine.

import React from 'react';
import { IconCloud, IconEntry } from '@/components/ui/interactive-icon-cloud';

interface IntegrationsCloudSectionProps {
  title?: string;
  iconEntries: IconEntry[];
  containerClassName?: string;
  titleClassName?: string;
  cloudContainerClassName?: string;
}

export const IntegrationsCloudSection: React.FC<IntegrationsCloudSectionProps> = ({
  title = 'Integrations & Partners',
  iconEntries,
  containerClassName = 'py-16 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900',
  titleClassName = 'text-3xl md:text-4xl font-bold text-center text-slate-800 dark:text-white mb-12 md:mb-16',
  cloudContainerClassName = 'relative flex flex-col items-center justify-center w-full min-h-[300px] md:min-h-[400px] overflow-hidden rounded-lg',
}) => {
  if (!iconEntries || iconEntries.length === 0) {
    return null;
  }

  return (
    <section className={containerClassName}>
      <div className="container mx-auto px-4">
        {title && (
          <h2 className={titleClassName}>
            {title}
          </h2>
        )}
        <div className={cloudContainerClassName}>
          <IconCloud iconEntries={iconEntries} />
        </div>
      </div>
    </section>
  );
};

export default IntegrationsCloudSection; 