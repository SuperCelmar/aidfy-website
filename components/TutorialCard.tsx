import Link from 'next/link';
import Image from 'next/image';
import { Tutorial, getYouTubeThumbnail } from '@/lib/tutorials';

interface TutorialCardProps {
  tutorial: Tutorial;
}

const getDifficultyColor = (difficulty: string | null | undefined) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-700';
    case 'intermediate':
      return 'bg-uranian_blue-900/60 text-azul-500 border-uranian_blue-900';
    case 'advanced':
      return 'bg-persian_indigo-900/20 text-persian_indigo-700 border-persian_indigo-800';
    default:
      return 'bg-background text-foreground border-border';
  }
};

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  const thumbnailUrl = getYouTubeThumbnail(tutorial.youtube_url, 'hqdefault');

  return (
    <Link href={`/tutorials/${tutorial.slug}`} className="group">
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg hover:border-uranian_blue-900 transition-all duration-200 h-full">
        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-uranian_blue-900/40">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={tutorial.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-uranian_blue-900 to-persian_indigo-900/30">
              <div className="text-primary">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-card/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Duration Badge */}
          {tutorial.estimated_duration && (
            <div className="absolute top-3 right-3">
              <span className="bg-black/70 text-card text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                {tutorial.estimated_duration}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tags and Difficulty */}
          <div className="flex items-center gap-2 mb-3">
            {tutorial.difficulty_level && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getDifficultyColor(tutorial.difficulty_level)}`}>
                {tutorial.difficulty_level.charAt(0).toUpperCase() + tutorial.difficulty_level.slice(1)}
              </span>
            )}
            {tutorial.tags && tutorial.tags.length > 0 && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-uranian_blue-800 text-azul-500 border border-uranian_blue-900">
                {tutorial.tags[0]}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {tutorial.title}
          </h3>

          {/* Description */}
          <p className="text-muted text-sm line-clamp-3 mb-4">
            {tutorial.description || 'Learn essential skills and techniques in this comprehensive tutorial.'}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted">
            <span>
              {new Date(tutorial.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10h.01M5 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tutorial</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 