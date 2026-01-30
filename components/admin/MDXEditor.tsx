'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

type PreviewMode = 'edit' | 'live' | 'preview';

interface MDXEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MDXEditor({ value, onChange }: MDXEditorProps) {
  const [height, setHeight] = useState(720);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('edit');
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.classList.contains('dark')
      || window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Sync with app theme when class on html changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark');
      setColorMode(dark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div data-color-mode={colorMode} className="[&_.w-md-editor]:rounded-lg">
      <div className="flex gap-1 mb-2">
        {(['edit', 'live', 'preview'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setPreviewMode(mode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              previewMode === mode
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            {mode === 'edit' ? 'Edit only' : mode === 'live' ? 'Split' : 'Preview only'}
          </button>
        ))}
      </div>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={height}
        preview={previewMode}
        hideToolbar={false}
        enableScroll={true}
        visibleDragbar={true}
        onHeightChange={(h) => h && setHeight(Number(h))}
        highlightEnable={true}
      />
    </div>
  );
}
