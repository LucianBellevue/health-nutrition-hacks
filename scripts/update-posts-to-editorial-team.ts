import dotenv from 'dotenv';
import prisma from '../lib/prisma';

// Load environment variables
dotenv.config();

/**
 * Migration script to update all posts to use editorial team author
 * 
 * This script:
 * 1. Finds or creates an admin user for editorial team
 * 2. Updates all published posts to use that user's ID as authorId
 * 3. The getAuthorByIdOrDefault function will map this to "editorial-team"
 */
async function updatePostsToEditorialTeam() {
  console.log('🚀 Starting migration to editorial team author...\n');

  try {
    // Find the first admin user (or create one if none exists)
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!adminUser) {
      console.log('⚠️  No admin user found. Creating one...');
      // You'll need to provide an email and password for the admin user
      // For now, we'll just use the first user we find
      const anyUser = await prisma.user.findFirst();
      if (!anyUser) {
        throw new Error('No users found in database. Please create an admin user first.');
      }
      adminUser = anyUser;
      console.log(`✅ Using existing user: ${adminUser.email}`);
    } else {
      console.log(`✅ Found admin user: ${adminUser.email} (ID: ${adminUser.id})`);
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

    console.log(`\n📊 Found ${posts.length} published posts\n`);

    if (posts.length === 0) {
      console.log('No posts to update.');
      await prisma.$disconnect();
      return;
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
    console.log(`   ⏭️  Skipped (already correct): ${skipped}`);
    console.log(`   📝 Total posts: ${posts.length}`);

    // Now we need to update getAuthorByIdOrDefault to map this user ID to "editorial-team"
    console.log(`\n📝 Next step: Update lib/authors.ts to map User ID "${adminUser.id}" to "editorial-team"`);
    console.log(`   You can do this by updating getAuthorByIdOrDefault function.`);

    // Verify the updates
    console.log('\n🔍 Verifying updates...\n');

    const updatedPostsCheck = await prisma.post.findMany({
      where: {
        published: true,
        authorId: adminUser.id,
      },
      select: {
        slug: true,
        title: true,
      },
      orderBy: { slug: 'asc' },
    });

    console.log(`✅ Verified: ${updatedPostsCheck.length} posts now use admin user as author`);
    if (updatedPostsCheck.length > 0 && updatedPostsCheck.length <= 10) {
      updatedPostsCheck.forEach((post) => {
        console.log(`   - ${post.slug}`);
      });
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await prisma.$disconnect();
    throw error;
  }
}

updatePostsToEditorialTeam()
  .then(() => {
    console.log('\n✨ Migration complete!');
    console.log('\n⚠️  IMPORTANT: You need to update lib/authors.ts');
    console.log('   Update getAuthorByIdOrDefault to map the admin user ID to "editorial-team"');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
