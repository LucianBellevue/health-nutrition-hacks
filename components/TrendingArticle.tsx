import Link from 'next/link';
import Image from 'next/image';
import { PostMetadata } from '@/lib/posts';
import CategoryBadge from './CategoryBadge';

interface TrendingArticleProps {
  post: PostMetadata;
}

/**
 * Compact article card for trending/recommended posts
 */
export default function TrendingArticle({ post }: TrendingArticleProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <section className="my-10 sm:my-14">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Trending Now
        </span>
      </div>
      
      <Link 
        href={`/blog/${post.slug}`}
        className="group block rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors"
      >
        <div className="flex flex-col sm:flex-row">
          {post.image && (
            <div className="relative w-full sm:w-40 md:w-48 shrink-0 aspect-video sm:aspect-square overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 640px) 192px, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          <div className="p-4 sm:p-5 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <CategoryBadge name={post.category} size="sm" />
              <span className="text-xs text-zinc-500 dark:text-zinc-500">{formattedDate}</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-1.5">
              {post.title}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
              {post.description}
            </p>
            <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Read article
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
