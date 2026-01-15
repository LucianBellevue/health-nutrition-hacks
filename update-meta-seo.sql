-- SQL Script to Update Meta Titles and Descriptions for Migrated Posts
-- Run this against your PostgreSQL database
-- Date: 2026-01-15

-- Update magnesium-benefits
UPDATE "Post" 
SET "metaTitle" = 'Magnesium Benefits: Why You Need This Essential Mineral',
    "metaDescription" = 'Discover the science-backed benefits of magnesium for sleep, muscle health, and stress relief. Learn optimal dosage and best supplement forms.'
WHERE slug = 'magnesium-benefits';

-- Update best-probiotic-for-women-gut-health
UPDATE "Post" 
SET "metaTitle" = 'Best Probiotic for Women: Complete Gut Health Guide 2026',
    "metaDescription" = 'Find the best probiotics for women''s digestive health, immunity, and hormonal balance. Expert recommendations and science-backed strains.'
WHERE slug = 'best-probiotic-for-women-gut-health';

-- Update best-suplement-for-energy-without-caffeine
UPDATE "Post" 
SET "metaTitle" = 'Best Supplements for Energy Without Caffeine | Natural Boost',
    "metaDescription" = 'Discover natural energy supplements without caffeine. From B-vitamins to adaptogens, get sustained energy without jitters or crashes.'
WHERE slug = 'best-suplement-for-energy-without-caffeine';

-- Update healthy-breakfast-ideas-energy-weight-loss
UPDATE "Post" 
SET "metaTitle" = 'Healthy Breakfast Ideas for Energy & Weight Loss | 15 Recipes',
    "metaDescription" = 'Start your day right with these healthy breakfast ideas proven to boost energy and support weight loss. Quick, nutritious recipes included.'
WHERE slug = 'healthy-breakfast-ideas-energy-weight-loss';

-- Update high-protein-snacks-for-weight-loss
UPDATE "Post" 
SET "metaTitle" = 'High Protein Snacks for Weight Loss: 20 Best Options 2026',
    "metaDescription" = 'Discover the best high-protein snacks to support weight loss and muscle building. Portable, satisfying options for busy lifestyles.'
WHERE slug = 'high-protein-snacks-for-weight-loss';

-- Update immune-boosting-habits
UPDATE "Post" 
SET "metaTitle" = 'Immune Boosting Habits: 10 Science-Backed Ways to Stay Healthy',
    "metaDescription" = 'Strengthen your immune system with these evidence-based daily habits. From nutrition to sleep, learn what actually works.'
WHERE slug = 'immune-boosting-habits';

-- Update metabolism-boosting-foods
UPDATE "Post" 
SET "metaTitle" = 'Metabolism Boosting Foods: What Actually Works for Weight Loss',
    "metaDescription" = 'Learn which foods genuinely boost metabolism and support fat loss. Science-backed nutrition strategies for a faster metabolic rate.'
WHERE slug = 'metabolism-boosting-foods';

-- Update morning-gut-routine-to-reduce-bloating
UPDATE "Post" 
SET "metaTitle" = 'Morning Gut Routine to Reduce Bloating | Digestive Health Tips',
    "metaDescription" = 'Start your day with this science-backed morning routine to reduce bloating and improve digestion. Simple steps for better gut health.'
WHERE slug = 'morning-gut-routine-to-reduce-bloating';

-- Update natural-stress-relief-supplements
UPDATE "Post" 
SET "metaTitle" = 'Natural Stress Relief Supplements: Best Options & Dosages',
    "metaDescription" = 'Find the best natural supplements for stress and anxiety relief. Expert guide to adaptogens, magnesium, and calming nutrients.'
WHERE slug = 'natural-stress-relief-supplements';

-- Update weight-loss-hacks
UPDATE "Post" 
SET "metaTitle" = 'Weight Loss Hacks: 15 Evidence-Based Tips That Work 2026',
    "metaDescription" = 'Discover proven weight loss hacks backed by science. Simple lifestyle changes and nutrition strategies for sustainable fat loss.'
WHERE slug = 'weight-loss-hacks';

-- Verify the updates
SELECT slug, "metaTitle", "metaDescription" 
FROM "Post" 
WHERE slug IN (
  'magnesium-benefits',
  'best-probiotic-for-women-gut-health',
  'best-suplement-for-energy-without-caffeine',
  'healthy-breakfast-ideas-energy-weight-loss',
  'high-protein-snacks-for-weight-loss',
  'immune-boosting-habits',
  'metabolism-boosting-foods',
  'morning-gut-routine-to-reduce-bloating',
  'natural-stress-relief-supplements',
  'weight-loss-hacks'
)
ORDER BY slug;
