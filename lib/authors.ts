export interface Author {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  social?: {
    twitter?: string;
    website?: string;
    linkedin?: string;
  };
}

/**
 * Authors database
 * Add new authors here to use them in blog posts
 */
export const authors: Author[] = [
  {
    id: 'sarah-mitchell',
    name: 'Dr. Sarah Mitchell',
    bio: 'Board-certified nutritionist with 10+ years of experience helping people achieve sustainable health goals through evidence-based nutrition.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    social: {
      twitter: 'https://twitter.com/drsarahnutrition',
      website: 'https://drsarahnutrition.com',
    },
  },
  {
    id: 'maria-rodriguez',
    name: 'Chef Maria Rodriguez',
    bio: 'Professional chef and meal prep expert specializing in healthy, flavor-packed recipes that fit busy lifestyles.',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    social: {
      website: 'https://chefmaria.com',
      linkedin: 'https://linkedin.com/in/mariarodriguez',
    },
  },
  {
    id: 'james-chen',
    name: 'James Chen, RD',
    bio: 'Registered dietitian focused on gut health, sports nutrition, and helping athletes optimize their performance through proper nutrition.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    social: {
      twitter: 'https://twitter.com/jamesrd',
      website: 'https://jamesnutrition.com',
    },
  },
  // Editorial Team Authors - For AI-generated content with human verification
  {
    id: 'editorial-team',
    name: 'HNH Editorial Team',
    bio: 'Our editorial team consists of nutrition professionals, registered dietitians, and health content specialists who review, fact-check, and verify all content for accuracy and evidence-based information. All articles undergo rigorous editorial review before publication.',
    avatarUrl: '/hnh_logo.svg',
    social: {
      website: 'https://healthnutritionhacks.com',
    },
  },
  {
    id: 'editorial-reviewer',
    name: 'Editorial Reviewer',
    bio: 'Content reviewed and verified by our editorial team of nutrition experts. All information is fact-checked against current scientific research and medical guidelines.',
    avatarUrl: '/hnh_logo.svg',
  },
];

/**
 * Get author by ID
 */
export function getAuthorById(id: string): Author | undefined {
  return authors.find((author) => author.id === id);
}

/**
 * Get all authors
 */
export function getAllAuthors(): Author[] {
  return authors;
}

/**
 * Get author by ID or return a default author if not found
 * 
 * Note: The id parameter can be either:
 * - An author ID from the authors array (e.g., "editorial-team", "sarah-mitchell")
 * - A User ID from the database (which will be mapped to editorial-team)
 */
export function getAuthorByIdOrDefault(id: string): Author {
  // First, try to find an exact match in authors array
  const author = getAuthorById(id);
  if (author) return author;

  // If not found, it's likely a User ID from the database
  // Map all User IDs to editorial-team for AI-generated content with human review
  // This ensures all posts get proper E-E-A-T attribution
  return getAuthorById('editorial-team') || {
    id: 'editorial-team',
    name: 'HNH Editorial Team',
    bio: 'Our editorial team consists of nutrition professionals, registered dietitians, and health content specialists who review, fact-check, and verify all content for accuracy and evidence-based information. All articles undergo rigorous editorial review before publication.',
    avatarUrl: '/hnh_logo.svg',
    social: {
      website: 'https://healthnutritionhacks.com',
    },
  };
}
