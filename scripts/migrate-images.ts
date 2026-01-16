import { config } from 'dotenv';
import { resolve } from 'path';
import prisma from '../lib/prisma';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });
config({ path: resolve(__dirname, '../.env') });

/**
 * Migration script to fix PostImage components that use Cloudinary URLs
 * Converts: <PostImage slug="..." src="https://res.cloudinary.com/..." ... />
 * To: <Image src="https://res.cloudinary.com/..." alt="..." width={800} height={450} className="rounded-xl my-8" />
 */

async function migrateImages() {
  console.log('Starting image migration...');
  
  try {
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
        console.log(`✓ Updated: ${post.title} (${post.slug})`);
      }
    }

    console.log(`\n✅ Migration complete! Updated ${updatedCount} post(s)`);
    
    if (updatedCount === 0) {
      console.log('No posts needed updating.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
