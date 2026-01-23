import Link from 'next/link';
import Image from "next/image";
import { memo } from 'react';
import { PostMetadata } from "@/lib/posts";
import CategoryBadge from "./CategoryBadge";
import TagPill from "./TagPill";

interface PostCardProps {
  post: PostMetadata;
}

// Date formatter instance (reused across renders)
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

/**
 * Card component for displaying post preview on blog index
 * Memoized to prevent unnecessary re-renders
 */
function PostCard({ post }: PostCardProps) {
  const formattedDate = dateFormatter.format(new Date(post.date));

  return (
    <article 
      className="group relative bg-white dark:bg-zinc-900/80 rounded-3xl border border-zinc-100 dark:border-zinc-800/70 shadow-sm hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:hover:shadow-zinc-900/60 transition-all duration-300 overflow-hidden h-full flex flex-col"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 500px' }}
    >
      {post.image && (
        <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
          <div className="aspect-16/10 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      )}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 sm:gap-3 text-sm mb-3 sm:mb-4">
          {post.category && (
            <CategoryBadge
              name={post.category}
              href={`/categories/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
            />
          )}
          <span className="text-zinc-400 dark:text-zinc-500">•</span>
          <time dateTime={post.date} className="text-zinc-500 dark:text-zinc-400">
            {formattedDate}
          </time>
        </div>

        <Link href={`/blog/${post.slug}`} className="block mb-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 leading-tight">
            {post.title}
          </h2>
        </Link>

        <p className="text-zinc-600 dark:text-zinc-400 mb-5 line-clamp-3 leading-relaxed flex-1 text-sm">
          {post.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
          {post.tags && post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <TagPill key={tag} label={tag} />
              ))}
            </div>
          ) : (
            <span />
          )}
          {post.readingTime && (
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {post.readingTime} min read
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(PostCard);
