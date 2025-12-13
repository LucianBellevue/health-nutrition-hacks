'use client';

import { useMemo } from 'react';
import { PostMetadata, Category } from '@/lib/posts';
import PostCard from './PostCard';
import SearchInput from './SearchInput';
import CategoryFilter from './CategoryFilter';
import EmptyState from './EmptyState';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery, setSelectedCategory, toggleFollowedCategory } from '@/store/slices/preferencesSlice';

interface BlogListProps {
  posts: PostMetadata[];
  categories: Category[];
}

/**
 * Client component for blog list with search and category filtering
 */
export default function BlogList({ posts, categories }: BlogListProps) {
  const dispatch = useAppDispatch();
  const { searchQuery, selectedCategory, followedCategories, initialized } = useAppSelector((state) => state.preferences);

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
          followedCategories={followedCategories}
          onToggleFollow={(slug) => dispatch(toggleFollowedCategory(slug))}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
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
