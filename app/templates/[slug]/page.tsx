import { getTemplateBySlug, getTemplateFiles, getAllTemplates, Template, TemplateFile } from '@/lib/templates';
// Image import removed as it's handled in Client Component
// Link import removed as it's handled in Client Component or not needed here
import { notFound } from 'next/navigation';
import TemplateDetailClient from '@/components/TemplateDetailClient';
import type { Metadata, ResolvingMetadata } from 'next';

interface TemplateDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate params for static site generation (optional, but good practice)
export async function generateStaticParams() {
  const templates = await getAllTemplates(); // Correctly use getAllTemplates
  return templates.map((template) => ({
    slug: template.slug,
  }));
}

// Generate metadata for the page (title, description)
export async function generateMetadata(
  { params }: TemplateDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) {
    return {
      title: 'Template Not Found',
      description: 'The template you are looking for does not exist.',
    };
  }

  return {
    title: `${template.title} | AI Template - AutomationDFY`,
    description: template.description.substring(0, 160), // Use template description for meta
    // openGraph: { images: [/* if you add an image field */] },
  };
}

// This is now an async Server Component
export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) {
    notFound(); 
  }
  
  const files: TemplateFile[] = await getTemplateFiles(template.id);

  return (
    // Adjusted height to account for a 4rem header and a 4rem footer (100vh - 8rem)
    // This provides the boundary for the TemplateDetailClient to fill.
    <div className="h-[calc(100vh-8rem)]">
       <TemplateDetailClient template={template} files={files} />
    </div>
  );
} 