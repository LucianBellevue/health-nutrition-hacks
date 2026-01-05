import React from 'react';

interface ProseProps {
  children: React.ReactNode;
}

/**
 * Prose component for wrapping article content with typography styles
 */
export default function Prose({ children }: ProseProps) {
  return (
    <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-code:text-emerald-700 dark:prose-code:text-emerald-300 prose-code:bg-emerald-50 dark:prose-code:bg-emerald-950 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-img:rounded-lg prose-img:shadow-md prose-li:text-zinc-700 dark:prose-li:text-zinc-300 prose-blockquote:text-zinc-600 dark:prose-blockquote:text-zinc-400 prose-blockquote:border-emerald-500">
      {children}
    </div>
  );
}
