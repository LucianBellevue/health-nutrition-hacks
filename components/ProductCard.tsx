interface ProductCardProps {
  store: 'amazon' | 'iherb';
  title: string;
  productName: string;
  href: string;
  description: string;
  cta?: string;
}

/**
 * Reusable product card for affiliate recommendations.
 *
 * Usage in MDX:
 * <ProductCard
 *   store="amazon"
 *   title="Best B-complex starter"
 *   productName="Nature Made Super B Complex"
 *   href="https://amazon.com/..."
 *   description="A simple foundation supplement..."
 *   cta="Check price on Amazon"
 * />
 */
export default function ProductCard({
  store,
  title,
  productName,
  href,
  description,
  cta,
}: ProductCardProps) {
  const isAmazon = store === 'amazon';
  
  const storeStyles = {
    amazon: {
      badge: 'text-emerald-600',
      link: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      accent: 'border-emerald-200/50',
    },
    iherb: {
      badge: 'text-teal-600',
      link: 'bg-teal-600 hover:bg-teal-700 text-white',
      accent: 'border-teal-200/50',
    },
  };

  const styles = storeStyles[store];
  const defaultCta = isAmazon ? 'View on Amazon' : 'View on iHerb';

  return (
    <article className="group rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/70 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] uppercase tracking-[0.2em] ${styles.badge} font-semibold`}>
              {isAmazon ? 'Amazon' : 'iHerb'}
            </span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
              {title}
            </h4>
          </div>
          <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {productName}
          </span>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 mt-3 text-xs font-semibold ${styles.badge} hover:underline`}
        >
          {cta || defaultCta}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </article>
  );
}
