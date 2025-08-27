import { getTutorialBySlug, getAllTutorials } from '@/lib/tutorials';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TutorialContent from '@/components/TutorialContent';

interface TutorialPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = await getTutorialBySlug(slug);

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
  const { slug } = await params;
  const tutorial = await getTutorialBySlug(slug);

  if (!tutorial) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <TutorialContent tutorial={tutorial} />
    </div>
  );
} 