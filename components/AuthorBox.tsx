import Image from "next/image";
import { Author } from "@/lib/authors";

interface AuthorBoxProps {
  author: Author;
}

/**
 * Author box component - displays author info with avatar, bio, and social links
 * Shows "Health Nutrition Hacks" as default if it's the default author
 */
export default function AuthorBox({ author }: AuthorBoxProps) {
  const isDefaultAuthor = author.id === "default";
  const highlightPills = isDefaultAuthor
    ? ["Editorially curated", "Science-backed", "Women’s gut health focus"]
    : ["Evidence-based", "Reader-friendly tips", "Trusted guidance"];

  return (
    <section className="relative my-8 sm:my-12">
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-3xl bg-linear-to-r from-emerald-500/20 via-teal-400/20 to-cyan-400/10 blur-3xl dark:opacity-70"
      />

      <div className="relative flex flex-col gap-6 sm:gap-8 border border-zinc-200/70 dark:border-zinc-800/70 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-zinc-900/80 backdrop-blur-2xl p-5 sm:p-6 md:p-10 shadow-[0_25px_80px_rgba(15,23,42,0.2)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-start items-center">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-zinc-900/5 dark:bg-white/5 ring-4 ring-white/80 dark:ring-zinc-900 shadow-lg overflow-hidden flex items-center justify-center">
              <Image
                src={author.avatarUrl}
                alt={author.name}
                fill
                sizes="120px"
                className={`transition-all duration-300 ${
                  isDefaultAuthor ? "object-contain scale-75" : "object-cover"
                }`}
                style={isDefaultAuthor ? { filter: "brightness(0) invert(1)" } : undefined}
                priority={false}
              />
            </div>
            {isDefaultAuthor && (
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 text-white text-xs font-semibold tracking-wide px-4 py-1 shadow-lg uppercase">
                HNH Studio
              </span>
            )}
          </div>

          {/* Author Info */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-[11px] font-semibold tracking-[0.45em] text-emerald-600 uppercase mb-3">
              {isDefaultAuthor ? "Editorial Insight" : "Author Spotlight"}
            </p>

            <div className="flex flex-col gap-1">
              <h3 className="text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
                {isDefaultAuthor ? "Health Nutrition Hacks Team" : author.name}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {isDefaultAuthor
                  ? "Multidisciplinary nutrition editors + RDs"
                  : "Evidence-based contributor"}
              </p>
            </div>

            <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mt-4">
              {author.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
              {highlightPills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800/70 text-zinc-800 dark:text-zinc-200 text-xs font-semibold tracking-wide uppercase px-3 py-1"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links */}
        {author.social && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {author.social.website && (
              <a
                href={author.social.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-emerald-200/70 dark:border-emerald-500/30 bg-linear-to-br from-emerald-50/80 to-white dark:from-emerald-500/10 dark:to-transparent px-5 py-4 text-sm font-semibold text-emerald-700 dark:text-emerald-200 flex items-center justify-between transition hover:border-emerald-400"
              >
                Website
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  ↗
                </span>
              </a>
            )}
            {author.social.twitter && (
              <a
                href={author.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 px-5 py-4 text-sm font-semibold text-zinc-700 dark:text-zinc-200 flex items-center justify-between transition hover:border-emerald-300"
              >
                Twitter
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  ↗
                </span>
              </a>
            )}
            {author.social.linkedin && (
              <a
                href={author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 px-5 py-4 text-sm font-semibold text-zinc-700 dark:text-zinc-200 flex items-center justify-between transition hover:border-emerald-300"
              >
                LinkedIn
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  ↗
                </span>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
