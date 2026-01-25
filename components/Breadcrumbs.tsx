import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb navigation component
 * Provides visible navigation path and complements breadcrumb schema for SEO
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-zinc-400 flex-wrap">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-zinc-500" />
            {index === items.length - 1 ? (
              <span className="text-zinc-700 dark:text-zinc-300 font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
