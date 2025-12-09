import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

/**
 * Site header with logo, navigation, and theme toggle
 */
export default function Header() {
  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Health Nutrition Hacks
            </span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link
              href="/blog"
              className="text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/categories"
              className="text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/#about"
              className="text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
            >
              About
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
