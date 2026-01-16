import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Starting image migration...');
    
    // Fetch all posts
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
      },
    });

    console.log(`Found ${posts.length} posts to check`);

    let updatedCount = 0;
    const updatedPosts: string[] = [];

    for (const post of posts) {
      const content = post.content;
      let hasChanges = false;

      // Pattern to match PostImage components with Cloudinary URLs
      const postImagePattern = /<PostImage\s+slug="[^"]*"\s+src="(https:\/\/res\.cloudinary\.com\/[^"]+)"\s+alt="([^"]*)"\s+variant="[^"]*"\s*\/>/g;
      
      // Replace with Image component
      const newContent = content.replace(postImagePattern, (match, src, alt) => {
        hasChanges = true;
        return `<Image src="${src}" alt="${alt}" width={800} height={450} className="rounded-xl my-8" />`;
      });

      if (hasChanges) {
        // Update the post in database
        await prisma.post.update({
          where: { id: post.id },
          data: { content: newContent },
        });

        updatedCount++;
        updatedPosts.push(`${post.title} (${post.slug})`);
        console.log(`✓ Updated: ${post.title} (${post.slug})`);
      }
    }

    console.log(`\n✅ Migration complete! Updated ${updatedCount} post(s)`);
    
    return NextResponse.json({
      success: true,
      totalPosts: posts.length,
      updatedCount,
      updatedPosts,
      message: `Successfully updated ${updatedCount} post(s)`,
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
