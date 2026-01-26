import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MDXRemote } from 'next-mdx-remote/rsc';
import prisma from '@/lib/prisma';
import { getAuthorByIdOrDefault } from '@/lib/authors';
import { auth } from '@/lib/auth';
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
import NewsletterCTA from '@/components/NewsletterCTA';
import ContentDisclosure from '@/components/ContentDisclosure';
import { AlertCircle } from 'lucide-react';

// Dynamic imports for non-critical components
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

export const metadata: Metadata = {
  title: 'Preview – Health Nutrition Hacks',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PreviewPage({ params }: Props) {
  // Check authentication
  const session = await auth();
  if (!session) {
    redirect('/admin/login');
  }

  const { slug } = await params;
  
  // Fetch post WITHOUT published filter to allow previewing drafts
  const post = await prisma.post.findUnique({
    where: { slug },
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
      } 
    };
    
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

  // Use updatedAt if post has been updated, otherwise use createdAt
  // Ensure dates are Date objects
  const updatedAt = post.updatedAt instanceof Date ? post.updatedAt : new Date(post.updatedAt);
  const createdAt = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt);
  
  const displayDate = updatedAt.getTime() !== createdAt.getTime()
    ? updatedAt
    : createdAt;
  
  const formattedDate = displayDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Check if post was updated (for showing "Updated" label)
  const isUpdated = updatedAt.getTime() !== createdAt.getTime();

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Preview Mode Banner */}
      <div className="sticky top-0 z-50 bg-amber-500 text-white px-4 py-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold text-sm">Preview Mode</p>
              <p className="text-xs text-amber-100">
                {post.published ? 'Viewing published post' : 'Viewing unpublished draft'}
              </p>
            </div>
          </div>
          <a
            href={`/admin/posts/${post.slug}/edit`}
            className="px-4 py-2 bg-white text-amber-600 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium"
          >
            Back to Editor
          </a>
        </div>
      </div>

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
            <time dateTime={displayDate.toISOString()}>
              {formattedDate}
              {isUpdated && (
                <span className="ml-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded">
                  Updated
                </span>
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

        {/* Content Disclosure - Show for editorial team only */}
        {shouldShowDisclosure && <ContentDisclosure />}

        {/* Article Content */}
        <Prose>
          {post.format === 'mdx' ? (
            <MDXRemote source={post.content} components={components} options={options} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          )}
        </Prose>

        {/* Author Box - Bottom (repeated for engagement) */}
        <AuthorBox author={author} />

        {/* Newsletter Signup */}
        <div className="my-8 sm:my-12">
          <NewsletterSignup 
            title="Enjoyed this article?"
            description="Get more evidence-based nutrition tips, healthy recipes, and wellness advice delivered to your inbox every week."
          />
        </div>

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
