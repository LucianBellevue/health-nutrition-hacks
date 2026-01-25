import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * API endpoint to update all published posts to use editorial team author
 * 
 * This updates all posts' authorId to use the current admin user,
 * which will then be mapped to "editorial-team" via getAuthorByIdOrDefault
 */
export async function POST() {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🚀 Starting author update migration...');

    // Get the current admin user
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Get all published posts
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: {
        id: true,
        slug: true,
        title: true,
        authorId: true,
      },
    });

    console.log(`Found ${posts.length} published posts`);

    if (posts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No published posts to update',
        totalPosts: 0,
        updatedCount: 0,
        skippedCount: 0,
      });
    }

    let updated = 0;
    let skipped = 0;
    const updatedPosts: string[] = [];

    // Update each post to use the admin user's ID
    for (const post of posts) {
      // Only update if authorId is different
      if (post.authorId !== adminUser.id) {
        try {
          await prisma.post.update({
            where: { id: post.id },
            data: { authorId: adminUser.id },
          });

          updated++;
          updatedPosts.push(`${post.title} (${post.slug})`);
          console.log(`✅ Updated: ${post.slug}`);
        } catch (error) {
          console.error(`❌ Error updating ${post.slug}:`, error);
        }
      } else {
        skipped++;
        console.log(`⏭️  Already using admin user: ${post.slug}`);
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📝 Total posts: ${posts.length}`);

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updated} post(s) to use editorial team author`,
      totalPosts: posts.length,
      updatedCount: updated,
      skippedCount: skipped,
      updatedPosts: updatedPosts.slice(0, 20), // Limit to first 20 for response size
      note: 'All posts now use the editorial team author. The getAuthorByIdOrDefault function maps User IDs to "editorial-team" automatically.',
    });
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
