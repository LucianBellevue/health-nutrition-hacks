import Link from 'next/link';
import Image from 'next/image';

/**
 * Site header with logo, navigation, and theme toggle
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="bg-linear-to-br from-emerald-500 to-teal-500 py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white text-sm font-medium">
          🌱 Your trusted source for evidence-based nutrition tips
        </div>
      </div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/hnh_logo.svg"
              alt="Health Nutrition Hacks logo"
              width={32}
              height={32}
              className="invert-0 dark:invert"
              priority
            />
            <span className="text-lg sm:text-xl font-bold text-white whitespace-nowrap">
              Health Nutrition Hacks
            </span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between text-sm sm:text-base">
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
          </div>
        </div>
      </nav>
    </header>
  );
}
