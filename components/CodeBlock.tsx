'use client';

import { useState } from 'react';

interface CodeBlockProps {
  content: string;
  language: string;
  fileName?: string;
}

export default function CodeBlock({ content, language, fileName }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLanguageDisplay = (lang: string) => {
    const languageMap: Record<string, string> = {
      'js': 'JavaScript',
      'javascript': 'JavaScript',
      'jsx': 'React JSX',
      'ts': 'TypeScript',
      'typescript': 'TypeScript',
      'tsx': 'React TSX',
      'py': 'Python',
      'python': 'Python',
      'sql': 'SQL',
      'json': 'JSON',
      'yaml': 'YAML',
      'yml': 'YAML',
      'html': 'HTML',
      'markup': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'bash': 'Bash',
      'shell': 'Shell',
      'sh': 'Shell',
      'md': 'Markdown',
      'markdown': 'Markdown',
      'txt': 'Text',
      'text': 'Text',
      'env': 'Environment'
    };
    return languageMap[lang.toLowerCase()] || lang.toUpperCase();
  };

  const getLanguageColor = (lang: string) => {
    const colorMap: Record<string, string> = {
      'javascript': 'bg-yellow-500',
      'js': 'bg-yellow-500',
      'typescript': 'bg-blue-500',
      'ts': 'bg-blue-500',
      'jsx': 'bg-cyan-500',
      'tsx': 'bg-cyan-600',
      'python': 'bg-green-500',
      'py': 'bg-green-500',
      'sql': 'bg-orange-500',
      'json': 'bg-gray-500',
      'yaml': 'bg-purple-500',
      'yml': 'bg-purple-500',
      'html': 'bg-red-500',
      'markup': 'bg-red-500',
      'css': 'bg-blue-600',
      'scss': 'bg-pink-500',
      'bash': 'bg-gray-700',
      'shell': 'bg-gray-700',
      'sh': 'bg-gray-700',
      'env': 'bg-emerald-500'
    };
    return colorMap[lang.toLowerCase()] || 'bg-slate-500';
  };

  // Basic syntax highlighting using CSS classes and regex patterns
  const highlightSyntax = (code: string, lang: string): string => {
    let highlighted = code;
    
    // Escape HTML
    highlighted = highlighted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    switch (lang.toLowerCase()) {
      case 'sql':
        // SQL keywords
        highlighted = highlighted.replace(
          /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|ALTER|DROP|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|DEFAULT|UNIQUE|CHECK|CONSTRAINT|AND|OR|IN|LIKE|BETWEEN|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|AS|CASE|WHEN|THEN|ELSE|END|COUNT|SUM|AVG|MIN|MAX|DISTINCT|UNION|ALL|EXISTS|ANY|SOME|VALUES|INTO|SET|GRANT|REVOKE|COMMIT|ROLLBACK|TRANSACTION|BEGIN|DECLARE|IF|WHILE|FOR|LOOP|PROCEDURE|FUNCTION|TRIGGER|VIEW|SCHEMA|DATABASE|USE|SHOW|DESCRIBE|EXPLAIN|ANALYZE)\b/gi,
          '<span class="token keyword">$1</span>'
        );
        // Strings
        highlighted = highlighted.replace(
          /'([^'\\]|\\.)*'/g,
          '<span class="token string">$&</span>'
        );
        // Comments
        highlighted = highlighted.replace(
          /--.*$/gm,
          '<span class="token comment">$&</span>'
        );
        break;

      case 'javascript':
      case 'js':
      case 'typescript':
      case 'ts':
        // Keywords
        highlighted = highlighted.replace(
          /\b(const|let|var|function|async|await|return|if|else|for|while|do|switch|case|default|break|continue|try|catch|finally|throw|class|extends|import|export|from|as|typeof|instanceof|new|this|super|static|get|set|true|false|null|undefined|void|never|any|string|number|boolean|object|Array|Promise|Date|Error|RegExp|Map|Set|WeakMap|WeakSet|Symbol|BigInt)\b/g,
          '<span class="token keyword">$1</span>'
        );
        // Strings
        highlighted = highlighted.replace(
          /(["'`])(?:(?=(\\?))\2.)*?\1/g,
          '<span class="token string">$&</span>'
        );
        // Comments
        highlighted = highlighted.replace(
          /\/\/.*$/gm,
          '<span class="token comment">$&</span>'
        );
        highlighted = highlighted.replace(
          /\/\*[\s\S]*?\*\//g,
          '<span class="token comment">$&</span>'
        );
        // Functions
        highlighted = highlighted.replace(
          /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
          '<span class="token function">$1</span>('
        );
        break;

      case 'python':
      case 'py':
        // Keywords
        highlighted = highlighted.replace(
          /\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|break|continue|pass|raise|assert|global|nonlocal|lambda|and|or|not|in|is|True|False|None|self|cls)\b/g,
          '<span class="token keyword">$1</span>'
        );
        // Strings
        highlighted = highlighted.replace(
          /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
          '<span class="token string">$&</span>'
        );
        // Comments
        highlighted = highlighted.replace(
          /#.*$/gm,
          '<span class="token comment">$&</span>'
        );
        // Functions
        highlighted = highlighted.replace(
          /\bdef\s+([a-zA-Z_][a-zA-Z0-9_]*)/g,
          '<span class="token keyword">def</span> <span class="token function">$1</span>'
        );
        break;

      case 'json':
        // Property names
        highlighted = highlighted.replace(
          /"([^"]+)":/g,
          '<span class="token property">"$1"</span>:'
        );
        // String values
        highlighted = highlighted.replace(
          /:\s*"([^"]*)"/g,
          ': <span class="token string">"$1"</span>'
        );
        // Numbers
        highlighted = highlighted.replace(
          /:\s*(-?\d+\.?\d*)/g,
          ': <span class="token number">$1</span>'
        );
        // Booleans and null
        highlighted = highlighted.replace(
          /\b(true|false|null)\b/g,
          '<span class="token boolean">$1</span>'
        );
        break;

      case 'bash':
      case 'shell':
      case 'sh':
        // Commands and options
        highlighted = highlighted.replace(
          /\b(echo|ls|cd|mkdir|rm|cp|mv|grep|find|sort|uniq|head|tail|cat|less|more|chmod|chown|ps|kill|top|df|du|tar|gzip|curl|wget|ssh|scp|rsync|git|npm|yarn|pip|python|node|docker|kubectl)\b/g,
          '<span class="token keyword">$1</span>'
        );
        // Flags
        highlighted = highlighted.replace(
          /\s(-[a-zA-Z0-9]+|--[a-zA-Z0-9-]+)/g,
          ' <span class="token punctuation">$1</span>'
        );
        // Strings
        highlighted = highlighted.replace(
          /(["'])(?:(?=(\\?))\2.)*?\1/g,
          '<span class="token string">$&</span>'
        );
        // Comments
        highlighted = highlighted.replace(
          /#.*$/gm,
          '<span class="token comment">$&</span>'
        );
        break;

      default:
        // Generic highlighting for other languages
        // Strings
        highlighted = highlighted.replace(
          /(["'`])(?:(?=(\\?))\2.)*?\1/g,
          '<span class="token string">$&</span>'
        );
        // Comments (// and /* */)
        highlighted = highlighted.replace(
          /\/\/.*$/gm,
          '<span class="token comment">$&</span>'
        );
        highlighted = highlighted.replace(
          /\/\*[\s\S]*?\*\//g,
          '<span class="token comment">$&</span>'
        );
        break;
    }

    return highlighted;
  };

  const highlightedContent = highlightSyntax(content, language);

  return (
    <div className="relative group bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden my-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {fileName && (
            <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {fileName}
            </span>
          )}
          <span className={`px-3 py-1 ${getLanguageColor(language)} text-white text-xs rounded-full font-medium shadow-sm`}>
            {getLanguageDisplay(language)}
          </span>
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md transition-all duration-200 text-xs font-medium"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      
      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed bg-white dark:bg-gray-900">
          <code 
            className="text-gray-900 dark:text-gray-100 font-mono"
            dangerouslySetInnerHTML={{ __html: highlightedContent }}
          />
        </pre>
      </div>
    </div>
  );
} 