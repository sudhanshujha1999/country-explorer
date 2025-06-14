// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import useAuthStore from '@/lib/auth-store';

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-theme shadow-theme px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side: Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo or Title */}
          <Link href="/" className="text-xl font-semibold text-theme">
            GlobeTrekker
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="relative text-theme hover:text-accent transition-all duration-200 px-3 py-2 rounded-md hover:bg-accent/10 font-medium group"
            >
              Explore
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full"></span>
            </Link>
            {isAuthenticated && (
              <Link 
                href="/favorites" 
                className="relative text-theme hover:text-accent transition-all duration-200 px-3 py-2 rounded-md hover:bg-accent/10 font-medium group"
              >
                Favorites
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full"></span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right side: Theme toggle and user actions */}
        <div className="flex items-center gap-3">
          {mounted && (
            <button 
              className="flex cursor-pointer items-center gap-2 px-3 py-2 border border-theme rounded-md hover:bg-accent/10 hover:border-accent transition-all duration-200 text-sm font-medium text-theme hover:text-accent" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="text-md">{theme === 'dark' ? '🌞' : '🌙'}</span>
              <span className="hidden sm:inline">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>
          )}
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-muted">
                Welcome, {user?.username}
              </span>
              <button 
                onClick={logout}
                className="text-sm cursor-pointer text-theme hover:text-accent transition-all duration-200 px-3 py-2 rounded-md hover:bg-accent/10 font-medium border border-transparent hover:border-accent"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="flex cursor-pointer items-center gap-2 px-3 py-2 border border-theme rounded-md hover:bg-accent/10 hover:border-accent transition-all duration-200 text-sm font-medium text-theme hover:text-accent">
                <UserCircleIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;