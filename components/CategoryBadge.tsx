import Link from 'next/link';
import { memo } from 'react';

interface CategoryBadgeProps {
  name: string;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Category badge component - displays a category with optional link
 * Memoized to prevent unnecessary re-renders
 */
function CategoryBadge({ name, href, size = 'sm' }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const baseClasses = `inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-medium transition-colors ${sizeClasses[size]}`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} hover:bg-emerald-200 dark:hover:bg-emerald-900 hover:text-emerald-900 dark:hover:text-emerald-200`}
      >
        {name}
      </Link>
    );
  }

  return <span className={baseClasses}>{name}</span>;
}

export default memo(CategoryBadge);
