import Image from 'next/image';

interface PostImageProps {
  slug: string;
  src: string;
  alt: string;
  variant?: 'hero' | 'section' | 'inline';
  priority?: boolean;
}

/**
 * Reusable post image component that auto-resolves paths based on post slug.
 * Images should be stored in: /public/images/posts/[slug]/[filename]
 * 
 * Usage in MDX:
 * <PostImage slug="best-probiotic-for-women-gut-health" src="hero.webp" alt="..." variant="hero" />
 */
export default function PostImage({
  slug,
  src,
  alt,
  variant = 'section',
  priority = false,
}: PostImageProps) {
  const imagePath = `/images/posts/${slug}/${src}`;

  const variants = {
    hero: {
      wrapper: 'not-prose my-10',
      container:
        'relative overflow-hidden rounded-[32px] border border-emerald-100/80 bg-white/60 shadow-[0_35px_80px_rgba(16,185,129,0.15)] aspect-[16/8]',
      overlay: 'absolute inset-0 bg-linear-to-r from-emerald-900/10 via-transparent to-white/0',
    },
    section: {
      wrapper: 'not-prose my-10',
      container:
        'relative overflow-hidden rounded-[28px] border border-emerald-100/80 bg-white/60 shadow-[0_25px_60px_rgba(15,23,42,0.18)] aspect-[16/9]',
      overlay: 'absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/30 to-transparent',
    },
    inline: {
      wrapper: 'not-prose my-8',
      container:
        'relative overflow-hidden rounded-2xl border border-zinc-100 bg-white/40 shadow-md aspect-[16/9]',
      overlay: '',
    },
  };

  const style = variants[variant];

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <Image
          src={imagePath}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 896px, 100vw"
          className="object-cover"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
        {style.overlay && <div className={style.overlay} />}
      </div>
    </div>
  );
}
