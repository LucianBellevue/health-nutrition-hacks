import Link from 'next/link';
import Image from "next/image";
import { PostMetadata } from "@/lib/posts";
import CategoryBadge from "./CategoryBadge";
import TagPill from "./TagPill";

interface PostCardProps {
  post: PostMetadata;
}

/**
 * Card component for displaying post preview on blog index
 */
export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md dark:hover:shadow-zinc-800/50 transition-shadow duration-200 overflow-hidden h-full flex flex-col">
      {post.image && (
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="aspect-video w-full overflow-hidden bg-zinc-100 relative">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              priority={false}
            />
          </div>
        </Link>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          <time dateTime={post.date} className="text-zinc-700 dark:text-zinc-400">{formattedDate}</time>
          {post.readingTime && (
            <>
              <span>•</span>
              <span className="text-zinc-700 dark:text-zinc-400">{post.readingTime} min read</span>
            </>
          )}
        </div>

        {post.category && (
          <div className="mb-3">
            <CategoryBadge name={post.category} href={`/categories/${post.category.toLowerCase().replace(/\s+/g, '-')}`} />
          </div>
        )}

        <Link href={`/blog/${post.slug}`} className="block mb-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
            {post.title}
          </h2>
        </Link>

        <p className="text-zinc-700 dark:text-zinc-300 mb-4 line-clamp-3 leading-relaxed flex-1">
          {post.description}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {post.tags.map((tag) => (
              <TagPill key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
