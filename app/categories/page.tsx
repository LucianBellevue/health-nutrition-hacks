import { Metadata } from "next";
import Link from "next/link";
import { getAllCategories, normalizeCategoryToSlug } from "@/lib/db-posts";
import { CATEGORY_CATALOG } from "@/lib/categoryConfig";
import Breadcrumbs from '@/components/Breadcrumbs';

const SITE_URL = 'https://healthnutritionhacks.com';
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent('Browse All Categories')}&category=Categories&author=HNH Team`;

export const metadata: Metadata = {
  title: 'Categories – Health Nutrition Hacks',
  description: 'Browse all categories of nutrition and health topics.',
  alternates: {
    canonical: `${SITE_URL}/categories`,
  },
  openGraph: {
    title: 'Categories – Health Nutrition Hacks',
    description: 'Browse all categories of nutrition and health topics.',
    url: `${SITE_URL}/categories`,
    siteName: 'Health Nutrition Hacks',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Health Nutrition Hacks Categories',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Categories – Health Nutrition Hacks',
    description: 'Browse all categories of nutrition and health topics.',
    site: '@healthnutritionhacks',
    creator: '@healthnutritionhacks',
    images: [OG_IMAGE],
  },
};

/**
 * Categories index page - lists all categories
 */
export default async function CategoriesPage() {
  const categoryCounts = await getAllCategories();
  const countsBySlug = new Map(categoryCounts.map((category) => [category.slug, category.count]));
  const categories = CATEGORY_CATALOG.map((definition) => {
    const slug = normalizeCategoryToSlug(definition.name);
    return {
      ...definition,
      slug,
      count: countsBySlug.get(slug) ?? 0,
    };
  });

  const breadcrumbItems = [{ name: 'Categories', href: '/categories' }];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumbs items={breadcrumbItems} />
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.4em] text-emerald-400 mb-4">Categories</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Browse by Category
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
            Explore every topic we cover—each card shows how much content is waiting for you, even as new posts arrive.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group"
            >
              <div className="rounded-2xl border border-zinc-800 bg-linear-to-b from-zinc-900/80 to-zinc-900/30 p-6 h-full shadow-[0_0_40px_rgba(6,182,212,0.08)] group-hover:border-emerald-500/60 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-emerald-300 group-hover:text-emerald-200 transition-colors">
                    {category.name}
                  </h2>
                  <span className="shrink-0 ml-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-300 text-base font-semibold">
                    {category.count}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
                  {category.description}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {category.count === 0 ? "Coming soon" : `${category.count} ${category.count === 1 ? "Post" : "Posts"}`}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500 text-lg">No categories yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
