'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tutorial, getYouTubeVideoId } from '@/lib/tutorials';
import CodeBlock from '@/components/CodeBlock';

interface TutorialContentProps {
  tutorial: Tutorial;
}

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}



// Advanced Markdown Parser
class MarkdownParser {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  // Parse code blocks first to prevent markdown processing inside them
  private parseCodeBlocks(text: string): { html: string; codeBlocks: Map<string, { content: string; language: string; fileName?: string }>; inlineCodeMap: Map<string, string> } {
    const codeBlocks = new Map<string, { content: string; language: string; fileName?: string }>();
    let blockIndex = 0;

    let html = text;
    
    // Handle fenced code blocks with language and optional filename
    // Simple regex that only captures language and code content
    const fencedCodeRegex = /```(\w+)?\s*[\r\n]+([\s\S]*?)```/g;
    
    html = html.replace(fencedCodeRegex, (match, language = 'txt', code) => {
      const blockId = `__CODE_BLOCK_${blockIndex++}__`;
      
      codeBlocks.set(blockId, {
        content: code.trim(),
        language: language?.toLowerCase() || 'txt',
        fileName: undefined
      });
      
      return blockId;
    });

    // Store inline code with placeholders to process after HTML escaping
    const inlineCodeMap = new Map<string, string>();
    let codeIndex = 0;
    
    html = html.replace(/`([^`\n]+)`/g, (match, content) => {
      const placeholder = `__INLINE_CODE_PLACEHOLDER_${codeIndex++}__`;
      inlineCodeMap.set(placeholder, content);
      return placeholder;
    });

    return { html, codeBlocks, inlineCodeMap };
  }

  // Extract table of contents from headers (excluding code blocks)
  private extractTableOfContents(text: string): TableOfContentsItem[] {
    const toc: TableOfContentsItem[] = [];
    
    // First, remove all code blocks to avoid including headers from code
    const textWithoutCodeBlocks = text.replace(/```[\s\S]*?```/g, '');
    
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    let match;

    while ((match = headingRegex.exec(textWithoutCodeBlocks)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      toc.push({ id, text, level });
    }

    return toc;
  }

  // Process markdown to HTML
  private processMarkdown(text: string, inlineCodeMap: Map<string, string>): string {
    let html = text;

    // Escape HTML-like tags first
    html = html.replace(/<([^>]+)>/g, '&lt;$1&gt;');
    
    // Now process inline code placeholders after HTML escaping
    inlineCodeMap.forEach((content, placeholder) => {
      // The content is already safe since HTML was escaped above
      const styledCode = `<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400">${content}</code>`;
      html = html.replace(placeholder, styledCode);
    });

    // Headers with IDs for navigation
    html = html.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
      const level = hashes.length;
      const id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const className = {
        1: 'text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8',
        2: 'text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6',
        3: 'text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-5',
        4: 'text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4',
        5: 'text-base font-semibold text-gray-900 dark:text-white mb-2 mt-3',
        6: 'text-sm font-semibold text-gray-900 dark:text-white mb-2 mt-3'
      }[level] || 'text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-3';

      return `<h${level} id="${id}" class="scroll-mt-24 ${className} group">
        <a href="#${id}" class="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-700 no-underline mr-2" aria-label="Link to this section">#</a>
        ${text}
      </h${level}>`;
    });

    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-bold"><em class="italic">$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>');

    // Enhanced Lists with proper nesting support
    html = this.processLists(html);

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic">$1</blockquote>');

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr class="my-8 border-gray-300 dark:border-gray-600">');

    // Paragraphs
    html = html.replace(/\n\n+/g, '</p><p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">');
    html = `<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">${html}</p>`;

    // Clean up empty paragraphs
    html = html.replace(/<p[^>]*><\/p>/g, '');

    return html;
  }

  // Enhanced list processing to handle nested lists
  private processLists(text: string): string {
    const lines = text.split('\n');
    const result: string[] = [];
    let inList = false;
    let listStack: { type: 'ul' | 'ol', level: number }[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Match list items with indentation
      const bulletMatch = line.match(/^(\s*)[-*+]\s+(.+)$/);
      const numberMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
      
      if (bulletMatch || numberMatch) {
        const indent = (bulletMatch?.[1] || numberMatch?.[1] || '').length;
        const content = bulletMatch?.[2] || numberMatch?.[3] || '';
        const isNumbered = !!numberMatch;
        const level = Math.floor(indent / 2); // Assuming 2 spaces per level
        
        // Handle list nesting
        while (listStack.length > level + 1) {
          const closingList = listStack.pop();
          result.push(`</${closingList?.type}>`);
        }
        
        if (listStack.length === level) {
          const listType = isNumbered ? 'ol' : 'ul';
          const listClass = level === 0 
            ? (isNumbered ? 'list-decimal list-inside mb-4 space-y-2' : 'list-disc list-inside mb-4 space-y-2')
            : (isNumbered ? 'list-decimal list-inside mt-2 space-y-1 ml-6' : 'list-disc list-inside mt-2 space-y-1 ml-6');
          
          result.push(`<${listType} class="${listClass}">`);
          listStack.push({ type: listType, level });
        }
        
        result.push(`<li class="text-gray-700 dark:text-gray-300">${content}</li>`);
        inList = true;
      } else {
        // Close all open lists when we encounter a non-list line
        if (inList && line.trim() === '') {
          // Empty line within list - just add it
          result.push(line);
        } else if (inList && line.trim() !== '') {
          // Non-list content - close all lists
          while (listStack.length > 0) {
            const closingList = listStack.pop();
            result.push(`</${closingList?.type}>`);
          }
          result.push(line);
          inList = false;
        } else {
          result.push(line);
        }
      }
    }
    
    // Close any remaining open lists
    while (listStack.length > 0) {
      const closingList = listStack.pop();
      result.push(`</${closingList?.type}>`);
    }
    
    return result.join('\n');
  }

  parse(): { html: string; toc: TableOfContentsItem[]; codeBlocks: Map<string, { content: string; language: string; fileName?: string }> } {
    // First, extract table of contents
    const toc = this.extractTableOfContents(this.content);

    // Parse code blocks and get placeholders
    const { html: htmlWithPlaceholders, codeBlocks, inlineCodeMap } = this.parseCodeBlocks(this.content);

    // Process the rest of the markdown
    const html = this.processMarkdown(htmlWithPlaceholders, inlineCodeMap);

    return { html, toc, codeBlocks };
  }
}

export default function TutorialContent({ tutorial }: TutorialContentProps) {
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [parsedContent, setParsedContent] = useState<string>('');
  const [codeBlocks, setCodeBlocks] = useState<Map<string, { content: string; language: string; fileName?: string }>>(new Map());

  const videoId = getYouTubeVideoId(tutorial.youtube_url);

  useEffect(() => {
    const parser = new MarkdownParser(tutorial.content);
    const { html, toc, codeBlocks: blocks } = parser.parse();
    
    setTableOfContents(toc);
    setParsedContent(html);
    setCodeBlocks(blocks);
  }, [tutorial.content]);

  // Handle active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => document.getElementById(item.id)).filter(Boolean);
      
      if (sections.length === 0) return;
      
      // Find the section that's currently in view
      let currentSection = null;
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          
          // Check if section is in viewport (with some offset for header)
          if (rect.top <= 120) {
            currentSection = section;
          } else {
            break;
          }
        }
      }
      
      // If we're at the top of the page, highlight the first section
      if (window.scrollY < 100 && sections[0]) {
        currentSection = sections[0];
      }
      
      // If we're at the bottom of the page, highlight the last section
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && sections[sections.length - 1]) {
        currentSection = sections[sections.length - 1];
      }
      
      if (currentSection && currentSection.id !== activeSection) {
        setActiveSection(currentSection.id);
      }
    };

    // Initial call
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents, activeSection]);

  // Render content with code blocks
  const renderContent = () => {
    // Split content by code block placeholders and render mixed content
    const parts = [];
    let remainingContent = parsedContent;
    const codeBlockIds = Array.from(codeBlocks.keys());
    
    codeBlockIds.forEach((blockId, index) => {
      const blockIndex = remainingContent.indexOf(blockId);
      if (blockIndex !== -1) {
        // Add content before the code block
        const beforeContent = remainingContent.substring(0, blockIndex);
        if (beforeContent) {
          parts.push(
            <div 
              key={`content-${index}`}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: beforeContent }}
            />
          );
        }
        
        // Add the code block component
        parts.push(renderCodeBlock(blockId));
        
        // Update remaining content
        remainingContent = remainingContent.substring(blockIndex + blockId.length);
      }
    });
    
    // Add any remaining content
    if (remainingContent) {
      parts.push(
        <div 
          key="content-final"
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: remainingContent }}
        />
      );
    }
    
    return <>{parts}</>;
  };

  // Create a custom component map for rendering
  const renderCodeBlock = (blockId: string) => {
    const blockProps = codeBlocks.get(blockId);
    if (!blockProps) return null;
    
    return (
      <CodeBlock
        key={blockId}
        content={blockProps.content}
        language={blockProps.language}
        fileName={blockProps.fileName}
      />
    );
  };

  const getDifficultyColor = (difficulty: string | null | undefined) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-700';
      case 'intermediate':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-700';
      case 'advanced':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-700';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Table of Contents */}
              <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-transform duration-300 ease-in-out`}>
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Table of Contents</h2>
            <button
              onClick={() => setSidebarOpen(false)}
                              className="lg:hidden p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Tutorial Meta */}
          <div className="space-y-3">
            {tutorial.difficulty_level && (
              <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full border ${getDifficultyColor(tutorial.difficulty_level)}`}>
                {tutorial.difficulty_level.charAt(0).toUpperCase() + tutorial.difficulty_level.slice(1)}
              </span>
            )}
            
            {tutorial.estimated_duration && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {tutorial.estimated_duration}
              </div>
            )}
            
            {tutorial.tags && tutorial.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tutorial.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 px-2 py-1 rounded-full border border-orange-200 dark:border-orange-700">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <nav className="p-6">
          {tableOfContents.length > 0 ? (
            <ul className="space-y-1">
              {tableOfContents.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1.5 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      item.level === 1 ? 'font-semibold text-gray-900 dark:text-white border-l-2 border-transparent' :
                      item.level === 2 ? 'font-medium text-gray-700 dark:text-gray-300 ml-3 border-l-2 border-transparent' :
                      'text-gray-600 dark:text-gray-400 ml-6 border-l-2 border-transparent'
                    } ${activeSection === item.id ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-l-blue-600 dark:border-l-blue-400' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      {item.level === 1 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                      )}
                      {item.level === 2 && (
                        <span className="w-1 h-1 rounded-full bg-current opacity-40"></span>
                      )}
                      {item.level >= 3 && (
                        <span className="w-0.5 h-0.5 rounded-full bg-current opacity-30"></span>
                      )}
                      <span className="line-clamp-2">{item.text}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No sections found</p>
          )}
        </nav>

        {/* Back to Tutorials */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <Link 
            href="/tutorials" 
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tutorials
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:flex overflow-hidden">
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Table of Contents
              </button>
              
              <Link 
                href="/tutorials" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors"
              >
                Back to Tutorials
              </Link>
            </div>

            {/* Tutorial Header */}
            <header className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {tutorial.title}
              </h1>
              
              {tutorial.description && (
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {tutorial.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>
                  Published {new Date(tutorial.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                
                {tutorial.updated_at !== tutorial.created_at && (
                  <span>
                    Updated {new Date(tutorial.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                )}
              </div>
            </header>

            {/* Tutorial Content */}
            {renderContent()}
          </div>
        </div>

        {/* Video Sidebar */}
                  {videoId && (
            <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Video Tutorial</h3>
              
              <div className="aspect-video mb-4">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={tutorial.title}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
              
              <div className="space-y-3">
                <a
                  href={tutorial.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Watch on YouTube
                </a>
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Follow along with the video while reading the tutorial content.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
} 