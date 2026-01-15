import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface PostMetadata {
  title: string;
  description: string;
  date: string;
  author?: string;
  authorId?: string;
  category: string;
  tags: string[];
  image?: string;
  readingTime?: number;
}

async function getCategoryIdByName(categoryName: string): Promise<string | null> {
  const result = await pool.query(
    'SELECT id FROM "Category" WHERE name = $1',
    [categoryName]
  );
  return result.rows[0]?.id || null;
}

async function getAdminUserId(): Promise<string | null> {
  const result = await pool.query(
    'SELECT id FROM "User" WHERE email = $1',
    [process.env.ADMIN_EMAIL]
  );
  return result.rows[0]?.id || null;
}

async function postExists(slug: string): Promise<boolean> {
  const result = await pool.query(
    'SELECT id FROM "Post" WHERE slug = $1',
    [slug]
  );
  return result.rows.length > 0;
}

async function migrateMDXFiles() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.mdx'));

  console.log(`Found ${files.length} MDX files to migrate\n`);

  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    console.error('Admin user not found. Please run seed-admin script first.');
    process.exit(1);
  }

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const slug = file.replace('.mdx', '');
    
    try {
      // Check if post already exists
      if (await postExists(slug)) {
        console.log(`⏭️  Skipping ${slug} - already exists`);
        skipped++;
        continue;
      }

      // Read and parse MDX file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      const metadata = data as PostMetadata;

      // Get category ID
      const categoryId = await getCategoryIdByName(metadata.category);
      if (!categoryId) {
        console.error(`❌ Error: Category "${metadata.category}" not found for ${slug}`);
        errors++;
        continue;
      }

      // Calculate reading time if not provided
      const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      const readingTime = metadata.readingTime || Math.ceil(wordCount / 200);

      // Insert post
      await pool.query(
        `INSERT INTO "Post" (
          id, title, slug, description, content, format, "categoryId",
          tags, image, published, "readingTime", "authorId",
          "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        )`,
        [
          metadata.title,
          slug,
          metadata.description,
          content,
          'mdx',
          categoryId,
          metadata.tags || [],
          metadata.image || null,
          true, // published
          readingTime,
          adminUserId,
          new Date(metadata.date),
          new Date(),
        ]
      );

      console.log(`✅ Migrated: ${slug}`);
      migrated++;
    } catch (error) {
      console.error(`❌ Error migrating ${slug}:`, error);
      errors++;
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`   ✅ Migrated: ${migrated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  
  await pool.end();
}

migrateMDXFiles()
  .then(() => {
    console.log('\n✨ Migration complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
