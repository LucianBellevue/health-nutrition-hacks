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
import TrendingArticle from '@/components/TrendingArticle';
import NewsletterCTA from '@/components/NewsletterCTA';

// Dynamic imports for non-critical components
const NewsletterSignup = dynamic(() => import('@/components/NewsletterSignup'), {
  loading: () => <div className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />,
});
const AdSenseInFeed = dynamic(() => import('@/components/AdSenseInFeed'));
const AdSenseInArticle = dynamic(() => import('@/components/AdSenseInArticle'));

// MDX components
const components = {
  AffiliateBlock,
  PostImage,
  ProductCard,
  NewsletterCTA,
  AdSenseInArticle,
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

const SITE_URL = 'https://www.healthnutritionhacks.com';

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

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

    const imageUrl = post.image 
      ? `${SITE_URL}${post.image.startsWith('/') ? '' : '/'}${post.image}`
      : `${SITE_URL}/android-chrome-512x512.png`;

    const metaTitle = post.metaTitle || post.title;
    const metaDescription = post.metaDescription || post.description;

    return {
      metadataBase: new URL(SITE_URL),
      title: `${metaTitle} – Health Nutrition Hacks`,
      description: metaDescription,
      authors: post.author.name ? [{ name: post.author.name }] : undefined,
      alternates: {
        canonical: `/blog/${slug}`,
      },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: 'article',
        url: `${SITE_URL}/blog/${slug}`,
        siteName: 'Health Nutrition Hacks',
        publishedTime: post.createdAt.toISOString(),
        authors: post.author.name ? [post.author.name] : undefined,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
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

  // Get author information
  const author = getAuthorByIdOrDefault(post.authorId);

  // Get trending post (excluding current post)
  const trendingPost = await prisma.post.findFirst({
    where: {
      published: true,
      slug: { not: slug },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {post.image && (
            <div className="aspect-video w-full rounded-xl overflow-hidden mb-8 shadow-lg">
              <Image
                src={post.image}
                alt={post.title}
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
            <time dateTime={post.createdAt.toISOString()}>{formattedDate}</time>
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

        {/* Author Box - Bottom */}
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
              date: trendingPost.createdAt.toISOString().split('T')[0],
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
    </article>
  );
}
