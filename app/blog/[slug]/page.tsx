import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getPostSlugs } from '@/lib/posts';
import { getAuthorByIdOrDefault } from '@/lib/authors';
import Prose from '@/components/Prose';
import AffiliateBlock from '@/components/AffiliateBlock';
import AuthorBox from '@/components/AuthorBox';
import NewsletterSignup from '@/components/NewsletterSignup';
import CategoryBadge from '@/components/CategoryBadge';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Image from 'next/image';
import PostImage from '@/components/PostImage';

// MDX components that can be used in posts
const components = {
  AffiliateBlock,
  PostImage,
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

/**
 * Generate static params for all blog posts
 */
export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const post = getPostBySlug(slug);
    const { metadata } = post;

    return {
      title: `${metadata.title} – Health Nutrition Hacks`,
      description: metadata.description,
      authors: metadata.author ? [{ name: metadata.author }] : undefined,
      openGraph: {
        title: metadata.title,
        description: metadata.description,
        type: 'article',
        publishedTime: metadata.date,
        authors: metadata.author ? [metadata.author] : undefined,
        images: metadata.image ? [metadata.image] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.title,
        description: metadata.description,
        images: metadata.image ? [metadata.image] : undefined,
      },
    };
  } catch {
    return {
      title: 'Post Not Found – Health Nutrition Hacks',
    };
  }
}

/**
 * Blog post page
 */
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  
  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { metadata, content } = post;

  // Get author information
  const author = getAuthorByIdOrDefault(metadata.authorId);

  const formattedDate = new Date(metadata.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-8">
          {metadata.image && (
            <div className="aspect-video w-full rounded-xl overflow-hidden mb-8 shadow-lg">
              <Image
                src={metadata.image}
                alt={metadata.title}
                className="w-full h-full object-cover"
                width={1200}
                height={630}
              />
            </div>
          )}
          
          <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-400 mb-4">
            {metadata.category && (
              <>
                <CategoryBadge 
                  name={metadata.category} 
                  href={`/categories/${metadata.category.toLowerCase().replace(/\s+/g, '-')}`}
                  size="md"
                />
                <span>•</span>
              </>
            )}
            <time dateTime={metadata.date}>{formattedDate}</time>
            {metadata.readingTime && (
              <>
                <span>•</span>
                <span>{metadata.readingTime} min read</span>
              </>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 leading-tight">
            {metadata.title}
          </h1>

          <p className="text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {metadata.description}
          </p>

          {metadata.tags && metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {metadata.tags.map((tag) => (
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
          <MDXRemote source={content} components={components} options={options} />
        </Prose>

        {/* Author Box - Bottom (repeated for engagement) */}
        <AuthorBox author={author} />

        {/* Newsletter Signup */}
        <div className="my-12">
          <NewsletterSignup 
            title="Enjoyed this article?"
            description="Get more evidence-based nutrition tips, healthy recipes, and wellness advice delivered to your inbox every week."
          />
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-6 border border-emerald-100 dark:border-emerald-900">
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <strong>Disclaimer:</strong> The information provided in this article is for educational purposes only and should not be considered medical advice. Always consult with a qualified healthcare professional before making any changes to your diet or health routine.
            </p>
          </div>
        </footer>
      </div>
    </article>
  );
}
