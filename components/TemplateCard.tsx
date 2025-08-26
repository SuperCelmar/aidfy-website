import Link from 'next/link';
// Image import removed as we don't have a direct thumbnail URL from Supabase yet
import { Template } from '@/lib/templates'; 

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link href={`/templates/${template.slug}`} className="block group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-card border-border h-full flex flex-col">
      {/* Thumbnail section removed for now - can be replaced with an icon or placeholder later */}
      {/* <div className="relative w-full aspect-video overflow-hidden"> 
        <Image
          src={template.thumbnailUrl} // This field no longer exists on the Template type from Supabase
          alt={`${template.title} thumbnail`}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </div> */}
      
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 group-hover:text-primary">
          {template.title}
        </h3>
        <p className="text-sm text-muted line-clamp-3 flex-grow">
          {template.description} {/* Displaying description instead of just title */}
        </p>
        <div className="mt-4 pt-2 border-t border-border">
            <span className="text-xs text-muted">
                Updated: {new Date(template.updated_at).toLocaleDateString()}
            </span>
        </div>
      </div>
    </Link>
  );
} 