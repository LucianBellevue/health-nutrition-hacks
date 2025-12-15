'use client';

import { Category } from '@/lib/posts';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategorySlug?: string;
  onChange: (categorySlug: string | undefined) => void;
}

/**
 * Category filter component - horizontal scrollable pills
 */
export default function CategoryFilter({
  categories,
  selectedCategorySlug,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => onChange(undefined)}
          className={`shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-colors ${
            !selectedCategorySlug
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-zinc-700 border border-zinc-300 hover:border-emerald-300 hover:bg-emerald-50'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => onChange(category.slug)}
            className={`shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              selectedCategorySlug === category.slug
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-zinc-700 border border-zinc-300 hover:border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            {category.name}
            <span className="ml-1.5 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
