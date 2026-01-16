'use client';

import Link from 'next/link';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  slug: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: {
    name: string | null;
    email: string;
  };
}

export default function PostsTable({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete post');
      }
    } catch {
      alert('An error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="bg-black rounded-xl border border-emerald-500/30 p-12 text-center">
        <p className="text-emerald-400">No posts found.</p>
        <Link
          href="/admin/posts/new"
          className="inline-block mt-4 text-emerald-400 hover:text-emerald-300 hover:underline"
        >
          Create your first post
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-xl border border-emerald-500/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-500/20">
            {posts.map((post) => (
              <tr
                key={post.id}
                className="hover:bg-emerald-500/10 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <Link
                      href={`/admin/posts/${post.slug}/edit`}
                      className="font-medium text-white hover:text-emerald-400"
                    >
                      {post.title}
                    </Link>
                    <span className="text-sm text-emerald-400">
                      {post.author.name || post.author.email}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs bg-zinc-800 text-white rounded border border-emerald-500/30">
                    {post.category.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      post.published
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-emerald-400">
                  {new Date(post.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {post.published && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                        title="View post"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.slug}/edit`}
                      className="p-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                      title="Edit post"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deletingId === post.id}
                      className="p-2 text-emerald-400 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
