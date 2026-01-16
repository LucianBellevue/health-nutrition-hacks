'use client';

import { signOut } from 'next-auth/react';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/posts', label: 'All Posts' },
  { href: '/admin/posts/new', label: 'New Post' },
];

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-emerald-500/20 z-50">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-emerald-500">
              HNH
            </span>
            <span className="text-white font-medium hidden sm:inline">
              Admin
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white">
              {user.name || 'Admin'}
            </p>
            <p className="text-xs text-emerald-400">
              {user.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-emerald-500/10 rounded-lg transition-colors border border-emerald-500/30"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-black border-b border-emerald-500/20 shadow-lg">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-white hover:bg-emerald-500/10'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-white hover:bg-emerald-500/10"
            >
              View Site
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
