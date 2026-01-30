import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MDXRemote } from 'next-mdx-remote/rsc';
import prisma from '@/lib/prisma';
import { getAuthorByIdOrDefault } from '@/lib/authors';
import Prose from '@/components/Prose';
import AffiliateBlock from '@/components/AffiliateBlock';
import AuthorBox from '@/components/AuthorBox';
import CategoryBadge from '@/components/CategoryBadge';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Image from 'next/image';
import PostImage from '@/components/PostImage';
import ProductCard from '@/components/ProductCard';
import BackButton from '@/components/BackButton';
import Breadcrumbs from '@/components/Breadcrumbs';
import TrendingArticle from '@/components/TrendingArticle';
import NewsletterCTA from '@/components/NewsletterCTA';
import FAQSection, { FAQItem } from '@/components/FAQSection';
import ContentDisclosure from '@/components/ContentDisclosure';
import { generateFAQSchema } from '@/lib/faqSchema';
import { getFAQsForPost } from '@/lib/faqSync';

// Dynamic imports for non-critical components to reduce initial JS bundle
const NewsletterSignup = dynamic(() => import('@/components/NewsletterSignup'), {
  loading: () => <div className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />,
});
const AdSenseInFeed = dynamic(() => import('@/components/AdSenseInFeed'));
const AdSenseInArticle = dynamic(() => import('@/components/AdSenseInArticle'));

// MDX components that can be used in posts
const components = {
  Image,
  AffiliateBlock,
  PostImage,
  ProductCard,
  NewsletterCTA,
  AdSenseInArticle,
  FAQSection,
};

// MDX options
const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE_URL = 'https://healthnutritionhacks.com';

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const post = await prisma.post.findUnique({
      where: { slug, published: true },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    if (!post) {
      return { title: 'Post Not Found – Health Nutrition Hacks' };
    }

    const metaTitle = post.metaTitle || post.title;
    const metaDescription = post.metaDescription || post.description;
    
    // Use post image if available, otherwise generate dynamic OG image
    const imageUrl = post.image 
      ? `${SITE_URL}${post.image.startsWith('/') ? '' : '/'}${post.image}`
      : `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category.name)}&author=${encodeURIComponent(post.author.name || 'HNH Team')}`;

    return {
      metadataBase: new URL(SITE_URL),
      title: `${metaTitle} – Health Nutrition Hacks`,
      description: metaDescription,
      keywords: post.tags,
      authors: post.author.name ? [{ name: post.author.name }] : undefined,
      alternates: {
        canonical: `${SITE_URL}/blog/${slug}`,
      },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: 'article',
        url: `${SITE_URL}/blog/${slug}`,
        siteName: 'Health Nutrition Hacks',
        locale: 'en_US',
        publishedTime: post.createdAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: post.author.name ? [post.author.name] : undefined,
        tags: post.tags,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
            type: 'image/png',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: 'Post Not Found – Health Nutrition Hacks',
    };
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: { select: { id: true, name: true, email: true } },
      category: { select: { name: true, slug: true } },
    },
  });

  if (!post) {
    notFound();
  }

  // Get author information from metadata or fallback to default
  let author;
  let shouldShowDisclosure = false; // Track if we should show AI disclosure
  let featuredImageAlt: string | undefined;
  
  if (post.metadata && typeof post.metadata === 'object') {
    const metadata = post.metadata as { 
      authorId?: string; 
      customAuthor?: { 
        name: string; 
        bio: string; 
        avatarUrl: string; 
        social?: { 
          website?: string; 
          twitter?: string; 
          linkedin?: string 
        } 
      };
      featuredImageAlt?: string;
    };
    
    // Extract featured image alt text
    featuredImageAlt = metadata.featuredImageAlt;
    
    // Check for custom author first (human author - no disclosure)
    if (metadata.customAuthor && metadata.authorId === 'custom') {
      author = {
        id: 'custom',
        name: metadata.customAuthor.name,
        bio: metadata.customAuthor.bio,
        avatarUrl: metadata.customAuthor.avatarUrl || '/hnh_logo.svg',
        social: metadata.customAuthor.social,
      };
      shouldShowDisclosure = false; // Custom authors are human - no disclosure
    } 
    // Check for specific author ID
    else if (metadata.authorId && metadata.authorId !== 'custom') {
      author = getAuthorByIdOrDefault(metadata.authorId);
      // Only show disclosure if explicitly editorial team
      shouldShowDisclosure = author.id === 'editorial-team' || author.id === 'editorial-reviewer';
    }
    // No authorId in metadata = default to editorial team (show disclosure)
    else {
      author = getAuthorByIdOrDefault(post.authorId);
      shouldShowDisclosure = true; // Default = editorial team = show disclosure
    }
  } else {
    // No metadata = default to editorial team (show disclosure)
    author = getAuthorByIdOrDefault(post.authorId);
    shouldShowDisclosure = true; // Default = editorial team = show disclosure
  }

  // Get trending post (excluding current post)
  const trendingPost = await prisma.post.findFirst({
    where: {
      published: true,
      slug: { not: slug },
    },
    orderBy: { updatedAt: 'desc' }, // Sort by updatedAt to show recently updated posts
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  // Use updatedAt if post has been updated, otherwise use createdAt
  const displayDate = post.updatedAt.getTime() !== post.createdAt.getTime()
    ? post.updatedAt
    : post.createdAt;
  
  const formattedDate = new Date(displayDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Check if post was updated (for showing "Updated" label)
  const isUpdated = post.updatedAt.getTime() !== post.createdAt.getTime();

  // Check if this is an editorial team author (for structured data and AuthorBox)
  // Custom authors should NOT be treated as editorial team
  const isEditorialTeam = author.id === 'editorial-team' || author.id === 'editorial-reviewer' || author.id === 'default';

  // Article structured data for SEO
  const articleSchema: {
    '@context': string;
    '@type': string;
    headline: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified: string;
    author: {
      '@type': string;
      name: string;
      url?: string;
      description?: string;
    };
    publisher: {
      '@type': string;
      name: string;
      logo: {
        '@type': string;
        url: string;
      };
    };
    mainEntityOfPage: {
      '@type': string;
      '@id': string;
    };
    keywords: string;
    articleSection: string;
    wordCount: number;
    editor?: {
      '@type': string;
      name: string;
      description: string;
    };
    about?: {
      '@type': string;
      name: string;
      description: string;
    };
  } = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category.name)}&author=${encodeURIComponent(author.name)}`,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: isEditorialTeam
      ? {
          '@type': 'Organization',
          name: author.name,
          url: author.social?.website || SITE_URL,
        }
      : {
          '@type': 'Person',
          name: author.name,
          url: author.social?.website,
          ...(author.bio ? { description: author.bio } : {}), // Include bio for custom authors if available
        },
    publisher: {
      '@type': 'Organization',
      name: 'Health Nutrition Hacks',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/hnh_logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category.name,
    wordCount: post.content.split(/\s+/).length,
  };

  // Add editorial review information for E-E-A-T (especially important for AI-generated content)
  if (isEditorialTeam) {
    articleSchema.editor = {
      '@type': 'Organization',
      name: 'Health Nutrition Hacks Editorial Team',
      description: 'Editorial team of nutrition professionals and registered dietitians who review and verify all content',
    };
    articleSchema.about = {
      '@type': 'Thing',
      name: 'Evidence-based nutrition information',
      description: 'Content reviewed and verified by nutrition experts',
    };
  }

  // BreadcrumbList structured data for rich snippets
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.category.name,
        item: `${SITE_URL}/categories/${post.category.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.title,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };

  // Get FAQs from database (preferred) or fallback to metadata
  let faqItems: FAQItem[] = [];
  let faqSchema = null;
  
  try {
    // Try to get FAQs from database first
    faqItems = await getFAQsForPost(post.id);
    
    // If no FAQs in database, fallback to metadata
    if (faqItems.length === 0 && post.metadata && typeof post.metadata === 'object') {
      const metadata = post.metadata as { faqs?: Array<{ question: string; answer: string }> };
      if (metadata.faqs && Array.isArray(metadata.faqs)) {
        faqItems = metadata.faqs;
      }
    }
    
    // Generate schema if we have FAQs
    if (faqItems.length > 0) {
      faqSchema = generateFAQSchema(faqItems);
    }
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    // Fallback to metadata if database query fails
    if (post.metadata && typeof post.metadata === 'object') {
      const metadata = post.metadata as { faqs?: Array<{ question: string; answer: string }> };
      if (metadata.faqs && Array.isArray(metadata.faqs)) {
        faqItems = metadata.faqs;
        faqSchema = generateFAQSchema(faqItems);
      }
    }
  }

  // Build breadcrumb items
  const breadcrumbItems = [
    { name: 'Blog', href: '/blog' },
    { name: post.category.name, href: `/categories/${post.category.slug}` },
    { name: post.title, href: `/blog/${slug}` },
  ];

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Article Header */}
        <header className="mb-8">
          {post.image && (
            <div className="aspect-video w-full rounded-xl overflow-hidden mb-8 shadow-lg">
              <Image
                src={post.image}
                alt={featuredImageAlt || post.title}
                className="w-full h-full object-cover"
                width={1200}
                height={630}
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 896px, 100vw"
              />
            </div>
          )}
          
          <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-400 mb-4">
            {post.category && (
              <>
                <CategoryBadge 
                  name={post.category.name} 
                  href={`/categories/${post.category.slug}`}
                  size="md"
                />
                <span>•</span>
              </>
            )}
            <time dateTime={displayDate.toISOString()}>
              {isUpdated ? (
                <>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Updated:</span> {formattedDate}
                </>
              ) : (
                formattedDate
              )}
            </time>
            {post.readingTime && (
              <>
                <span>•</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 sm:mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {post.description}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Author Box - Top */}
        <AuthorBox author={author} />

        {/* Article Content */}
        <Prose>
          {post.format === 'mdx' ? (
            <MDXRemote source={post.content} components={components} options={options} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          )}
        </Prose>

        {/* FAQ Section */}
        {faqItems.length > 0 && <FAQSection items={faqItems} />}

        {/* Content Disclosure - Always show for editorial team (default), never for human authors */}
        {shouldShowDisclosure && <ContentDisclosure />}

        {/* Author Box - Bottom (repeated for engagement) */}
        <AuthorBox author={author} />

        {/* Newsletter Signup */}
        <div className="my-8 sm:my-12">
          <NewsletterSignup 
            title="Enjoyed this article?"
            description="Get more evidence-based nutrition tips, healthy recipes, and wellness advice delivered to your inbox every week."
          />
        </div>

        {/* Trending Article */}
        {trendingPost && (
          <TrendingArticle 
            post={{
              title: trendingPost.title,
              description: trendingPost.description,
              slug: trendingPost.slug,
              date: trendingPost.updatedAt.getTime() !== trendingPost.createdAt.getTime()
                ? trendingPost.updatedAt.toISOString().split('T')[0]
                : trendingPost.createdAt.toISOString().split('T')[0],
              author: trendingPost.author.name || 'Unknown',
              authorId: trendingPost.authorId,
              category: trendingPost.category.name,
              tags: trendingPost.tags,
              image: trendingPost.image || undefined,
              readingTime: trendingPost.readingTime || undefined,
            }} 
          />
        )}

        {/* In-Feed Ad */}
        <AdSenseInFeed />

        {/* Article Footer */}
        <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4 sm:p-6 border border-emerald-100 dark:border-emerald-900">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <strong>Disclaimer:</strong> The information provided in this article is for educational purposes only and should not be considered medical advice. Always consult with a qualified healthcare professional before making any changes to your diet or health routine.
            </p>
          </div>
        </footer>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </article>
  );
}
