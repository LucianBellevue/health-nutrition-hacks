import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { FileText, Eye, PenSquare, Clock } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await auth();
  
  const [totalPosts, publishedPosts, draftPosts, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.post.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        updatedAt: true,
      },
    }),
  ]);

  const stats = [
    { label: 'Total Posts', value: totalPosts, icon: FileText, color: 'bg-blue-500' },
    { label: 'Published', value: publishedPosts, icon: Eye, color: 'bg-emerald-500' },
    { label: 'Drafts', value: draftPosts, icon: PenSquare, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {session?.user?.name || 'Admin'}!
        </h1>
        <p className="text-emerald-400 mt-1">
          Here&apos;s an overview of your blog
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-black rounded-xl p-6 shadow-sm border border-emerald-500/30"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-emerald-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Posts */}
      <div className="bg-black rounded-xl shadow-sm border border-emerald-500/30">
        <div className="p-6 border-b border-emerald-500/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Recent Posts
            </h2>
            <Link
              href="/admin/posts"
              className="text-sm text-emerald-400 hover:underline"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="divide-y divide-emerald-500/20">
          {recentPosts.length === 0 ? (
            <div className="p-6 text-center text-emerald-400">
              No posts yet.{' '}
              <Link
                href="/admin/posts/new"
                className="text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Create your first post
              </Link>
            </div>
          ) : (
            recentPosts.map((post: { id: string; title: string; slug: string; published: boolean; updatedAt: Date }) => (
              <div
                key={post.id}
                className="p-4 flex items-center justify-between hover:bg-emerald-500/10 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/posts/${post.slug}/edit`}
                    className="font-medium text-white hover:text-emerald-400 truncate block"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    post.published
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-4 p-6 bg-black rounded-xl border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors"
        >
          <PenSquare className="h-8 w-8 text-emerald-500" />
          <div>
            <h3 className="font-semibold text-white">
              Create New Post
            </h3>
            <p className="text-sm text-emerald-400">
              Write and publish a new blog post
            </p>
          </div>
        </Link>
        <Link
          href="/admin/posts"
          className="flex items-center gap-4 p-6 bg-black rounded-xl border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors"
        >
          <FileText className="h-8 w-8 text-emerald-500" />
          <div>
            <h3 className="font-semibold text-white">
              Manage Posts
            </h3>
            <p className="text-sm text-emerald-400">
              Edit, delete, or update existing posts
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
