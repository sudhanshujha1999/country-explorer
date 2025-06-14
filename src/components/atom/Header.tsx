// components/Header.tsx
'use client';

import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-theme shadow-theme px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo or Title */}
        <Link href="/" className="text-xl font-semibold text-theme">
          World Explorer
        </Link>

        {/* User profile icon and theme toggle */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-accent/20" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <button className="p-2 rounded-full hover:bg-accent/20">
            <UserCircleIcon className="w-8 h-8 text-muted" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;