import Image from "next/image";

interface AffiliateBlockProps {
  title: string;
  description: string;
  link: string;
  image?: string;
  cta?: string;
}

/**
 * Affiliate block component for embedding product recommendations in MDX posts
 * Can be used directly inside MDX: <AffiliateBlock title="..." description="..." link="..." />
 */
export default function AffiliateBlock({
  title,
  description,
  link,
  image,
  cta = 'Check it out',
}: AffiliateBlockProps) {
  return (
    <div className="my-8 not-prose">
      <div className="bg-linear-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {image && (
            <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-white relative">
              <Image
                src={image}
                alt={title}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              {title}
            </h3>
            <p className="text-zinc-700 mb-4 leading-relaxed">
              {description}
            </p>
            <a
              href={link}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              {cta} →
            </a>
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-4 italic">
          * This post may contain affiliate links. We may earn a commission if you make a purchase through our links, at no extra cost to you.
        </p>
      </div>
    </div>
  );
}
