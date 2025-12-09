import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostMetadata {
  title: string;
  description: string;
  date: string;
  author: string;
  authorId: string;
  category: string;
  tags?: string[];
  image?: string;
  readingTime?: number;
  slug: string;
}

export interface Post {
  metadata: PostMetadata;
  content: string;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

/**
 * Normalize a category name to a URL-safe slug
 */
export function normalizeCategoryToSlug(categoryName: string): string {
  return categoryName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

/**
 * Get all post slugs from the content/posts directory
 */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const files = fs.readdirSync(postsDirectory);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Get post by slug
 */
export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    metadata: {
      ...data,
      slug: realSlug,
    } as PostMetadata,
    content,
  };
}

/**
 * Get all posts sorted by date (newest first)
 */
export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((post1, post2) => (post1.metadata.date > post2.metadata.date ? -1 : 1));
  
  return posts;
}

/**
 * Get recent posts (limit optional)
 */
export function getRecentPosts(limit?: number): Post[] {
  const posts = getAllPosts();
  return limit ? posts.slice(0, limit) : posts;
}

/**
 * Get all unique categories with post counts
 */
export function getAllCategories(): Category[] {
  const posts = getAllPosts();
  const categoryMap = new Map<string, number>();

  posts.forEach((post) => {
    const category = post.metadata.category;
    if (category) {
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    }
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      name,
      slug: normalizeCategoryToSlug(name),
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get all posts in a specific category
 */
export function getPostsByCategory(categorySlug: string): Post[] {
  const allPosts = getAllPosts();
  
  return allPosts.filter((post) => {
    const postCategorySlug = normalizeCategoryToSlug(post.metadata.category);
    return postCategorySlug === categorySlug;
  });
}

/**
 * Get category name from slug
 */
export function getCategoryBySlug(categorySlug: string): Category | undefined {
  const categories = getAllCategories();
  return categories.find((cat) => cat.slug === categorySlug);
}

/**
 * Get all unique tags across all posts
 */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    if (post.metadata.tags) {
      post.metadata.tags.forEach((tag) => tagSet.add(tag));
    }
  });

  return Array.from(tagSet).sort();
}
