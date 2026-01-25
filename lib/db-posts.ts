import prisma from './prisma';

export interface PostMetadata {
  title: string;
  description: string;
  date: string; // Display date (uses updatedAt if different from createdAt)
  updatedAt?: string; // Last updated date for freshness signals
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

export function normalizeCategoryToSlug(categoryName: string): string {
  return categoryName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((post) => post.slug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: { name: true, id: true },
      },
      category: true,
    },
  });

  if (!post) return null;

  // Use updatedAt if post has been updated (different from createdAt), otherwise use createdAt
  const displayDate = post.updatedAt.getTime() !== post.createdAt.getTime()
    ? post.updatedAt.toISOString().split('T')[0]
    : post.createdAt.toISOString().split('T')[0];

  return {
    metadata: {
      title: post.title,
      description: post.description,
      date: displayDate,
      updatedAt: post.updatedAt.toISOString().split('T')[0],
      author: post.author.name || 'Unknown',
      authorId: post.authorId,
      category: post.category.name,
      tags: post.tags,
      image: post.image || undefined,
      readingTime: post.readingTime || undefined,
      slug: post.slug,
    },
    content: post.content,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { updatedAt: 'desc' }, // Sort by updatedAt to show recently updated posts first
    include: {
      author: {
        select: { name: true, id: true },
      },
      category: true,
    },
  });

  return posts.map((post) => {
    // Use updatedAt if post has been updated (different from createdAt), otherwise use createdAt
    const displayDate = post.updatedAt.getTime() !== post.createdAt.getTime()
      ? post.updatedAt.toISOString().split('T')[0]
      : post.createdAt.toISOString().split('T')[0];

    return {
      metadata: {
        title: post.title,
        description: post.description,
        date: displayDate,
        updatedAt: post.updatedAt.toISOString().split('T')[0],
        author: post.author.name || 'Unknown',
        authorId: post.authorId,
        category: post.category.name,
        tags: post.tags,
        image: post.image || undefined,
        readingTime: post.readingTime || undefined,
        slug: post.slug,
      },
      content: post.content,
    };
  });
}

export async function getRecentPosts(limit?: number): Promise<Post[]> {
  const posts = await getAllPosts();
  return limit ? posts.slice(0, limit) : posts;
}

export async function getAllCategories(): Promise<Category[]> {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { category: true },
  });

  const categoryMap = new Map<string, number>();

  posts.forEach((post) => {
    if (post.category) {
      categoryMap.set(post.category.name, (categoryMap.get(post.category.name) || 0) + 1);
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

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const allPosts = await getAllPosts();

  return allPosts.filter((post) => {
    const postCategorySlug = normalizeCategoryToSlug(post.metadata.category);
    return postCategorySlug === categorySlug;
  });
}

export async function getCategoryBySlug(categorySlug: string): Promise<Category | undefined> {
  const categories = await getAllCategories();
  return categories.find((cat) => cat.slug === categorySlug);
}

export async function getAllTags(): Promise<string[]> {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { tags: true },
  });

  const tagSet = new Set<string>();

  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => tagSet.add(tag));
    }
  });

  return Array.from(tagSet).sort();
}

export async function getTrendingPost(excludeSlug?: string): Promise<Post | null> {
  const posts = await getAllPosts();
  const filtered = excludeSlug
    ? posts.filter((post) => post.metadata.slug !== excludeSlug)
    : posts;

  return filtered.length > 0 ? filtered[0] : null;
}
