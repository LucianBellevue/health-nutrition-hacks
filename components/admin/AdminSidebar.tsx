'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
  Home,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'All Posts', icon: FileText },
  { href: '/admin/posts/new', label: 'New Post', icon: PlusCircle },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-black border-r border-emerald-500/20 hidden lg:block overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-white hover:bg-emerald-500/10'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        <hr className="my-4 border-emerald-500/20" />

        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-emerald-500/10 transition-colors"
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">View Site</span>
        </Link>
      </nav>
    </aside>
  );
}
