'use client';

import { useMemo, useState } from 'react';
import { PostMetadata, Category } from '@/lib/posts';
import PostCard from './PostCard';
import SearchInput from './SearchInput';
import CategoryFilter from './CategoryFilter';
import EmptyState from './EmptyState';
import Pagination from './Pagination';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery, setSelectedCategory } from '@/store/slices/preferencesSlice';

interface BlogListProps {
  posts: PostMetadata[];
  categories: Category[];
  postsPerPage?: number;
}

/**
 * Client component for blog list with search, category filtering, and pagination
 */
export default function BlogList({ posts, categories, postsPerPage = 9 }: BlogListProps) {
  const dispatch = useAppDispatch();
  const { searchQuery, selectedCategory, initialized } = useAppSelector((state) => state.preferences);
  
  // Track pagination with filter key to auto-reset when filters change
  const filterKey = `${searchQuery}|${selectedCategory}`;
  const [paginationState, setPaginationState] = useState({ page: 1, filterKey });

  // Auto-reset page to 1 when filters change (React 18+ pattern)
  if (paginationState.filterKey !== filterKey) {
    setPaginationState({ page: 1, filterKey });
  }

  const currentPage = paginationState.page;

  // Handle page change with smooth scroll to top
  const handlePageChange = (page: number) => {
    setPaginationState({ page, filterKey });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter posts based on search query and selected category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category filter
      if (selectedCategory) {
        const postCategorySlug = post.category.toLowerCase().replace(/\s+/g, '-');
        if (postCategorySlug !== selectedCategory) {
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableContent = [
          post.title,
          post.description,
          post.category,
          ...(post.tags || []),
        ]
          .join(' ')
          .toLowerCase();

        return searchableContent.includes(query);
      }

      return true;
    });
  }, [posts, searchQuery, selectedCategory]);

  // Calculate pagination for filtered posts
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <>
      {/* Filters Section */}
      <div className="mb-8 space-y-4">
        <SearchInput
          value={searchQuery}
          onChange={(value) => dispatch(setSearchQuery(value))}
          placeholder="Search posts by title, description, or tags..."
          disabled={!initialized}
        />
        <CategoryFilter
          categories={categories}
          selectedCategorySlug={selectedCategory}
          onChange={(slug) => dispatch(setSelectedCategory(slug))}
        />
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-zinc-700 dark:text-zinc-400">
          {filteredPosts.length === posts.length ? (
            <>Showing all {posts.length} posts</>
          ) : (
            <>
              Found {filteredPosts.length} of {posts.length} posts
            </>
          )}
        </p>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Pagination - Only show if more than one page */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No posts found"
          message={
            searchQuery
              ? `No posts match your search "${searchQuery}". Try different keywords or clear filters.`
              : 'No posts match your selected category. Try selecting a different category.'
          }
        />
      )}
    </>
  );
}
