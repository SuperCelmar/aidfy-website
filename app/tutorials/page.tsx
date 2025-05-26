import TutorialCard from '@/components/TutorialCard';
import { getAllTutorials, getAllTutorialTags, Tutorial } from '@/lib/tutorials';
import type { Metadata } from 'next';
import TutorialFilters from '@/components/TutorialFilters';

export const metadata: Metadata = {
  title: 'AI Tutorials | AutomationDFY',
  description: 'Learn automation and AI through our comprehensive video tutorials. Master no-code solutions, workflow automation, and business intelligence.',
};

export default async function TutorialsPage() {
  const [tutorials, availableTags] = await Promise.all([
    getAllTutorials(),
    getAllTutorialTags()
  ]);

  const totalTutorials = tutorials.length;
  const difficultyStats = {
    beginner: tutorials.filter(t => t.difficulty_level === 'beginner').length,
    intermediate: tutorials.filter(t => t.difficulty_level === 'intermediate').length,
    advanced: tutorials.filter(t => t.difficulty_level === 'advanced').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
              <section className="relative py-16 sm:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Tutorials Pill */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-600">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Tutorials
              </span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Master AI & Automation 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Step by Step</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Learn no-code automation, AI integration, and workflow optimization through hands-on video tutorials. 
              From beginner concepts to advanced implementations.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-blue-600">{totalTutorials}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Tutorials</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-green-600">{difficultyStats.beginner}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Beginner</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-blue-600">{difficultyStats.intermediate}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Intermediate</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-purple-600">{difficultyStats.advanced}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Advanced</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <TutorialFilters availableTags={availableTags} />

        {/* Tutorial Grid */}
        <div className="mt-8">
          {tutorials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutorials.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tutorials available</h3>
              <p className="text-gray-600 dark:text-gray-400">Check back soon for new learning content!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 