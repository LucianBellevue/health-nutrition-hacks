import React from 'react';

interface ProseProps {
  children: React.ReactNode;
}

/**
 * Prose component for wrapping article content with typography styles
 */
export default function Prose({ children }: ProseProps) {
  return (
    <div className="prose prose-lg prose-zinc max-w-none prose-headings:font-bold prose-headings:text-zinc-900 prose-p:text-zinc-700 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-900 prose-code:text-emerald-700 prose-code:bg-emerald-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-img:rounded-lg prose-img:shadow-md">
      {children}
    </div>
  );
}
