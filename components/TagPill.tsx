interface TagPillProps {
  label: string;
}

/**
 * Tag pill component - displays a tag as a small rounded pill
 */
export default function TagPill({ label }: TagPillProps) {
  return (
    <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 font-medium">
      {label}
    </span>
  );
}
