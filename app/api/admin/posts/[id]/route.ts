import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { name: true, email: true },
      },
      category: true,
    },
  });

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      content,
      format,
      categoryId,
      tags,
      image,
      published,
      scheduledAt,
      metaTitle,
      metaDescription,
      metadata,
    } = body;

    if (!title || !slug || !description || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug exists for another post
    const existingPost = await prisma.post.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }

    // Calculate reading time
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Merge author metadata with existing metadata (preserve FAQs if they exist)
    let updatedMetadata = metadata || {};
    if (metadata) {
      const existingPost = await prisma.post.findUnique({
        where: { id },
        select: { metadata: true },
      });
      
      if (existingPost?.metadata && typeof existingPost.metadata === 'object') {
        updatedMetadata = {
          ...(existingPost.metadata as object),
          ...metadata,
        };
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        content,
        format: format || 'html',
        categoryId,
        tags: tags || [],
        image: image || null,
        published: published || false,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        readingTime,
        metadata: Object.keys(updatedMetadata).length > 0 ? updatedMetadata : null,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
