import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PostEditor from '@/components/admin/PostEditor.mdx';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update your blog post
        </p>
      </div>
      <PostEditor
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          description: post.description,
          content: post.content,
          categoryId: post.categoryId,
          category: post.category,
          tags: post.tags,
          image: post.image || '',
          published: post.published,
          scheduledAt: post.scheduledAt?.toISOString().slice(0, 16) || '',
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          authorId: post.metadata && typeof post.metadata === 'object' 
            ? (post.metadata as { authorId?: string }).authorId 
            : undefined,
          customAuthor: post.metadata && typeof post.metadata === 'object' 
            ? (post.metadata as { customAuthor?: { name: string; bio: string; avatarUrl: string; social?: { website?: string; twitter?: string; linkedin?: string } } }).customAuthor 
            : undefined,
          metadata: post.metadata && typeof post.metadata === 'object'
            ? (post.metadata as Record<string, unknown>)
            : undefined,
        }}
      />
    </div>
  );
}
