import { getTutorialBySlug, getAllTutorials } from '@/lib/tutorials';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TutorialContent from '@/components/TutorialContent';

interface TutorialPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const tutorial = await getTutorialBySlug(params.slug);

  if (!tutorial) {
    return {
      title: 'Tutorial Not Found | AutomationDFY',
    };
  }

  return {
    title: `${tutorial.title} | AutomationDFY Tutorials`,
    description: tutorial.description || 'Learn automation and AI through comprehensive video tutorials.',
  };
}

// Generate static paths for published tutorials
export async function generateStaticParams() {
  const tutorials = await getAllTutorials();
  
  return tutorials.map((tutorial) => ({
    slug: tutorial.slug,
  }));
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const tutorial = await getTutorialBySlug(params.slug);

  if (!tutorial) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TutorialContent tutorial={tutorial} />
    </div>
  );
} 