'use client';

import { Category } from '@/lib/posts';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategorySlug?: string;
  onChange: (categorySlug: string | undefined) => void;
  followedCategories?: string[];
  onToggleFollow?: (categorySlug: string) => void;
}

/**
 * Category filter component - horizontal scrollable pills with optional follow toggles
 */
export default function CategoryFilter({
  categories,
  selectedCategorySlug,
  onChange,
  followedCategories = [],
  onToggleFollow,
}: CategoryFilterProps) {
  const isFollowed = (slug: string) => followedCategories.includes(slug);

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
          <div key={category.slug} className="flex items-center gap-1">
            <button
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
            {onToggleFollow && (
              <button
                type="button"
                onClick={() => onToggleFollow(category.slug)}
                aria-label={`${isFollowed(category.slug) ? 'Unfollow' : 'Follow'} ${category.name}`}
                className={`p-1 rounded-full border transition-colors ${
                  isFollowed(category.slug)
                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                    : 'border-zinc-300 text-zinc-400 hover:border-emerald-300 hover:text-emerald-600'
                }`}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill={isFollowed(category.slug) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M12 21s-6.143-4.35-8.485-8.037C1.172 9.688 2.012 6 4.929 5 6.609 4.433 8.21 5.09 9 6.273 9.79 5.09 11.391 4.433 13.071 5c2.917 1 3.757 4.688 1.414 7.963C18.143 16.65 12 21 12 21z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
