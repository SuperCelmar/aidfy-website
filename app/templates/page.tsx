import TemplateCard from '@/components/TemplateCard';
import { getAllTemplates, Template } from '@/lib/templates';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Templates | AutomationDFY',
  description: 'Browse our library of professional automation templates and functions designed to enhance your business operations.',
};

export default async function TemplatesPage() {
  const templates: Template[] = await getAllTemplates();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section Added Here */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-orange-50/50 via-red-50/30 to-pink-50/20 dark:from-slate-800/30 dark:via-slate-800/50 dark:to-slate-900/70 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center sm:text-left">
             {/* Templates Pill */}
             <span className="inline-block bg-white dark:bg-slate-700/80 px-4 py-1.5 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 shadow-md mb-6">
              Templates
            </span>
             {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                Accelerate your business with plug-and-play AI Templates
            </h1>
            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto sm:mx-0">
              Access our library of professional AI templates and functions built to enhance your business operations. These ready-to-deploy solutions for customer support, workflow automation, and business processes integrate seamlessly with your existing systems—helping you save time, increase efficiency, and focus on strategic priorities.
            </p>
          </div>
        </div>
        {/* Optional: Subtle background elements if needed */}
        {/* <div className="absolute inset-0 blur-3xl opacity-30" aria-hidden="true"> ... </div> */}
      </section>

      {/* Existing Template Grid */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        {templates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 py-12">
            No templates available at the moment. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
} 