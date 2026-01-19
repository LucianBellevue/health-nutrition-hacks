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
 */
export function getAuthorByIdOrDefault(id: string): Author {
  const author = getAuthorById(id);
  if (author) return author;

  // Default author if ID not found
  return {
    id: 'default',
    name: 'Health Nutrition Hacks Editorial Team',
    bio: 'Our team of nutrition experts and health professionals dedicated to bringing you evidence-based nutrition advice.',
    avatarUrl: '/hnh_logo.svg',
  };
}
