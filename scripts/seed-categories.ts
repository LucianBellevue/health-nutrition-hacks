import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const CATEGORIES = [
  {
    name: 'Energy',
    slug: 'energy',
    description: 'Evidence-based strategies for sustaining steady energy throughout the day.',
  },
  {
    name: 'Gut Health',
    slug: 'gut-health',
    description: 'Digestive system support, microbiome education, and probiotic-forward tips.',
  },
  {
    name: 'Meal Planning',
    slug: 'meal-planning',
    description: 'Weekly prep methods, grocery tactics, and time-saving kitchen systems.',
  },
  {
    name: 'Weight Loss',
    slug: 'weight-loss',
    description: 'Metabolism-friendly habits and realistic nutrition guidance for weight goals.',
  },
  {
    name: 'Heart Health',
    slug: 'heart-health',
    description: 'Cardiovascular-friendly recipes and nutrient tips for a stronger heart.',
  },
  {
    name: 'Mental Wellness',
    slug: 'mental-wellness',
    description: 'Nutrition, habits, and routines that nurture mood and cognitive balance.',
  },
];

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    console.log('Seeding categories...');

    for (const category of CATEGORIES) {
      const existing = await client.query(
        'SELECT id FROM "Category" WHERE slug = $1',
        [category.slug]
      );

      if (existing.rows.length > 0) {
        console.log(`Category "${category.name}" already exists, skipping...`);
        continue;
      }

      const id = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await client.query(
        `INSERT INTO "Category" (id, slug, name, description, "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [id, category.slug, category.name, category.description]
      );

      console.log(`✅ Created category: ${category.name}`);
    }

    console.log('\n✅ Categories seeded successfully!');
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error('Error seeding categories:', e);
  process.exit(1);
});
