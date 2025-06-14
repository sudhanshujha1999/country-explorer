'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import useAuthStore from '@/lib/auth-store';

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <header className="bg-theme shadow-theme px-4 py-3 sticky top-0 z-50" role="banner">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link 
            href="/" 
            className="text-xl font-semibold text-theme"
            aria-label="GlobeTrekker - Go to homepage"
            onClick={closeMobileMenu}
          >
            GlobeTrekker
          </Link>

          <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
            <Link 
              href="/" 
              className="relative text-theme hover:text-accent transition-all duration-200 px-3 py-2 rounded-md hover:bg-accent/10 font-medium group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Explore countries"
            >
              Explore
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full" aria-hidden="true"></span>
            </Link>
            {isAuthenticated && (
              <Link 
                href="/favorites" 
                className="relative text-theme hover:text-accent transition-all duration-200 px-3 py-2 rounded-md hover:bg-accent/10 font-medium group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="View your favorite countries"
              >
                Favorites
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full" aria-hidden="true"></span>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <button 
              className="flex cursor-pointer items-center gap-2 px-2 sm:px-3 py-2 border border-theme rounded-md hover:bg-accent/10 hover:border-accent transition-all duration-200 text-sm font-medium text-theme hover:text-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="text-md" aria-hidden="true">{theme === 'dark' ? '🌞' : '🌙'}</span>
              <span className="hidden sm:inline">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>
          )}
          
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="hidden lg:block text-sm text-muted" aria-label={`Logged in as ${user?.username}`}>
                  Welcome, {user?.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-sm cursor-pointer text-theme hover:text-accent transition-all duration-200 px-3 py-2 rounded-md hover:bg-accent/10 font-medium border border-transparent hover:border-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Sign out of your account"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link 
                href="/login"
                aria-label="Sign in to your account"
              >
                <button className="flex cursor-pointer items-center gap-2 px-3 py-2 border border-theme rounded-md hover:bg-accent/10 hover:border-accent transition-all duration-200 text-sm font-medium text-theme hover:text-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <UserCircleIcon className="w-5 h-5" aria-hidden="true" />
                  <span className="hidden sm:inline">Sign in</span>
                </button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-md text-theme hover:text-accent hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden mt-2 border-t border-theme bg-theme"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="px-4 py-3 space-y-3">
            <Link 
              href="/" 
              className="block text-theme hover:text-accent transition-colors py-2 px-3 rounded-md hover:bg-accent/10 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Explore countries"
              onClick={closeMobileMenu}
            >
              Explore
            </Link>
            {isAuthenticated && (
              <Link 
                href="/favorites" 
                className="block text-theme hover:text-accent transition-colors py-2 px-3 rounded-md hover:bg-accent/10 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="View your favorite countries"
                onClick={closeMobileMenu}
              >
                Favorites
              </Link>
            )}
            
            <div className="border-t border-theme pt-3 mt-3">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-sm text-muted px-3 py-1">
                    Welcome, {user?.username}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left text-theme hover:text-accent transition-colors py-2 px-3 rounded-md hover:bg-accent/10 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Sign out of your account"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="flex items-center gap-2 text-theme hover:text-accent transition-colors py-2 px-3 rounded-md hover:bg-accent/10 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Sign in to your account"
                  onClick={closeMobileMenu}
                >
                  <UserCircleIcon className="w-5 h-5" aria-hidden="true" />
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;