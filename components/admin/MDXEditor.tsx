'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface MDXEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MDXEditor({ value, onChange }: MDXEditorProps) {
  const [height, setHeight] = useState(600);

  return (
    <div data-color-mode="light" className="dark:data-color-mode-dark">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={height}
        preview="edit"
        hideToolbar={false}
        enableScroll={true}
        visibleDragbar={true}
        onHeightChange={(h) => h && setHeight(Number(h))}
        highlightEnable={true}
      />
    </div>
  );
}
