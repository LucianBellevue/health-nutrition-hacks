import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import PostsTable from '@/components/admin/PostsTable';

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || '';
  const status = params.status || 'all';

  const whereClause = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(status === 'published' && { published: true }),
    ...(status === 'draft' && { published: false }),
  };

  const posts = await prisma.post.findMany({
    where: whereClause,
    orderBy: { updatedAt: 'desc' },
    include: {
      author: {
        select: { name: true, email: true },
      },
      category: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your blog posts
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </form>
        <div className="flex gap-2">
          <Link
            href="/admin/posts"
            className={`px-4 py-2 rounded-lg transition-colors ${
              status === 'all'
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All
          </Link>
          <Link
            href="/admin/posts?status=published"
            className={`px-4 py-2 rounded-lg transition-colors ${
              status === 'published'
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Published
          </Link>
          <Link
            href="/admin/posts?status=draft"
            className={`px-4 py-2 rounded-lg transition-colors ${
              status === 'draft'
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Drafts
          </Link>
        </div>
      </div>

      {/* Posts Table */}
      <PostsTable posts={posts} />
    </div>
  );
}
