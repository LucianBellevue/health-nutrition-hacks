import dotenv from 'dotenv';
import prisma from '../lib/prisma';

// Load environment variables
dotenv.config();

async function updateMetaSEO() {
  console.log('🚀 Starting meta SEO update for migrated posts...\n');

  const updates = [
    {
      slug: 'magnesium-benefits',
      metaTitle: 'Magnesium Benefits: Why You Need This Essential Mineral',
      metaDescription: 'Discover the science-backed benefits of magnesium for sleep, muscle health, and stress relief. Learn optimal dosage and best supplement forms.'
    },
    {
      slug: 'best-probiotic-for-women-gut-health',
      metaTitle: 'Best Probiotic for Women: Complete Gut Health Guide 2026',
      metaDescription: 'Find the best probiotics for women\'s digestive health, immunity, and hormonal balance. Expert recommendations and science-backed strains.'
    },
    {
      slug: 'best-suplement-for-energy-without-caffeine',
      metaTitle: 'Best Supplements for Energy Without Caffeine | Natural Boost',
      metaDescription: 'Discover natural energy supplements without caffeine. From B-vitamins to adaptogens, get sustained energy without jitters or crashes.'
    },
    {
      slug: 'healthy-breakfast-ideas-energy-weight-loss',
      metaTitle: 'Healthy Breakfast Ideas for Energy & Weight Loss | 15 Recipes',
      metaDescription: 'Start your day right with these healthy breakfast ideas proven to boost energy and support weight loss. Quick, nutritious recipes included.'
    },
    {
      slug: 'high-protein-snacks-for-weight-loss',
      metaTitle: 'High Protein Snacks for Weight Loss: 20 Best Options 2026',
      metaDescription: 'Discover the best high-protein snacks to support weight loss and muscle building. Portable, satisfying options for busy lifestyles.'
    },
    {
      slug: 'immune-boosting-habits',
      metaTitle: 'Immune Boosting Habits: 10 Science-Backed Ways to Stay Healthy',
      metaDescription: 'Strengthen your immune system with these evidence-based daily habits. From nutrition to sleep, learn what actually works.'
    },
    {
      slug: 'metabolism-boosting-foods',
      metaTitle: 'Metabolism Boosting Foods: What Actually Works for Weight Loss',
      metaDescription: 'Learn which foods genuinely boost metabolism and support fat loss. Science-backed nutrition strategies for a faster metabolic rate.'
    },
    {
      slug: 'morning-gut-routine-to-reduce-bloating',
      metaTitle: 'Morning Gut Routine to Reduce Bloating | Digestive Health Tips',
      metaDescription: 'Start your day with this science-backed morning routine to reduce bloating and improve digestion. Simple steps for better gut health.'
    },
    {
      slug: 'natural-stress-relief-supplements',
      metaTitle: 'Natural Stress Relief Supplements: Best Options & Dosages',
      metaDescription: 'Find the best natural supplements for stress and anxiety relief. Expert guide to adaptogens, magnesium, and calming nutrients.'
    },
    {
      slug: 'weight-loss-hacks',
      metaTitle: 'Weight Loss Hacks: 15 Evidence-Based Tips That Work 2026',
      metaDescription: 'Discover proven weight loss hacks backed by science. Simple lifestyle changes and nutrition strategies for sustainable fat loss.'
    }
  ];

  let updated = 0;
  let errors = 0;

  for (const update of updates) {
    try {
      const result = await prisma.post.updateMany({
        where: { slug: update.slug },
        data: {
          metaTitle: update.metaTitle,
          metaDescription: update.metaDescription,
        },
      });

      if (result.count > 0) {
        console.log(`✅ Updated: ${update.slug}`);
        updated++;
      } else {
        console.log(`⚠️  Not found: ${update.slug}`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${update.slug}:`, error);
      errors++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ❌ Errors: ${errors}`);

  // Verify the updates
  console.log('\n🔍 Verifying updates...\n');

  const posts = await prisma.post.findMany({
    where: {
      slug: {
        in: updates.map(u => u.slug)
      }
    },
    select: {
      slug: true,
      metaTitle: true,
      metaDescription: true,
    },
    orderBy: { slug: 'asc' }
  });

  console.log('Posts with meta data:');
  posts.forEach(post => {
    const hasMetaTitle = post.metaTitle ? '✅' : '❌';
    const hasMetaDesc = post.metaDescription ? '✅' : '❌';
    console.log(`${hasMetaTitle} ${hasMetaDesc} ${post.slug}`);
  });

  await prisma.$disconnect();
}

updateMetaSEO()
  .then(() => {
    console.log('\n✨ Meta SEO update complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Update failed:', error);
    process.exit(1);
  });
