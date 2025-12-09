import { Author } from '@/lib/authors';

interface AuthorBoxProps {
  author: Author;
}

/**
 * Author box component - displays author info with avatar, bio, and social links
 * Shows "Health Nutrition Hacks" as default if it's the default author
 */
export default function AuthorBox({ author }: AuthorBoxProps) {
  const isDefaultAuthor = author.id === 'default';
  
  return (
    <div className="my-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <img
          src={author.avatarUrl}
          alt={author.name}
          className="w-16 h-16 rounded-full object-cover shrink-0"
        />

        {/* Author Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            {isDefaultAuthor ? 'Written by Health Nutrition Hacks' : 'About the Author'}
          </h3>
          {!isDefaultAuthor && (
            <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">{author.name}</h4>
          )}
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
            {author.bio}
          </p>

          {/* Social Links */}
          {author.social && (
            <div className="flex items-center gap-3">
              {author.social.website && (
                <a
                  href={author.social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors"
                >
                  Website
                </a>
              )}
              {author.social.twitter && (
                <a
                  href={author.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors"
                >
                  Twitter
                </a>
              )}
              {author.social.linkedin && (
                <a
                  href={author.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors"
                >
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
