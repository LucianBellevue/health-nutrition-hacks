import Link from 'next/link';
import Image from 'next/image';

/**
 * Site header with logo, navigation, and theme toggle
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="bg-linear-to-br from-emerald-500 to-teal-500 py-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center text-white text-xs sm:text-sm font-medium">
          🌱 Your trusted source for evidence-based nutrition tips
        </div>
      </div>
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-between py-3 sm:py-4">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <Image
              src="/hnh_logo.svg"
              alt="Health Nutrition Hacks logo"
              width={32}
              height={32}
              className="invert-0 dark:invert shrink-0"
              priority
            />
            <span className="text-base sm:text-xl font-bold text-white truncate">
              Health Nutrition Hacks
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-center sm:justify-end text-sm">
            <Link
              href="/"
              className="text-zinc-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-zinc-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/categories"
              className="text-zinc-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/contact"
              className="text-zinc-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
