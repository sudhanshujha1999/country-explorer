'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Country } from '@/types';
import CountryList from '@/components/organism/CountryList';
import ProtectedRoute from '@/components/molecules/ProtectedRoute';
import useFavoriteStore from '@/lib/store';
import { useSnackbar } from 'notistack';

export default function FavoritesPage() {
  const [favoriteCountries, setFavoriteCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavoriteStore();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchFavoriteCountries = async () => {
      if (favorites.length === 0) {
        setFavoriteCountries([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const countryCodes = favorites.join(',');
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${countryCodes}&fields=name,population,region,capital,flags,cca2`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle both single country (object) and multiple countries (array) responses
        const countries = Array.isArray(data) ? data : [data];
        setFavoriteCountries(countries);
      } catch (error) {
        console.error('Error fetching favorite countries:', error);
        enqueueSnackbar(
          error instanceof Error 
            ? `Failed to load favorite countries: ${error.message}` 
            : 'Failed to load favorite countries. Please try again later.',
          { 
            variant: 'error',
            autoHideDuration: 5000,
          }
        );
        setFavoriteCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteCountries();
  }, [favorites, enqueueSnackbar]);

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="container mx-auto py-6 sm:py-8" id="main-content">
          <div className="mb-6 sm:mb-8">
            <div className="h-8 sm:h-9 bg-gray-200 dark:bg-gray-700 rounded w-56 mb-2 px-4 sm:px-0 animate-pulse"></div>
            <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-72 px-4 sm:px-0 animate-pulse"></div>
          </div>

          {/* Country List skeleton */}
          <div className="px-4 sm:px-0">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Header skeleton - only show on desktop */}
              <div className="hidden sm:grid grid-cols-6 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                {['Flag', 'Name', 'Population', 'Region', 'Capital', 'Favorite'].map((_, i) => (
                  <div key={i} className={`h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse ${i >= 3 ? 'hidden md:block' : ''} ${i >= 4 ? 'hidden lg:block' : ''}`}></div>
                ))}
              </div>

              {/* Country rows skeleton */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-4">
                    {/* Mobile layout skeleton */}
                    <div className="sm:hidden">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-1 animate-pulse"></div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-14 animate-pulse"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-18 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout skeleton */}
                    <div className="hidden sm:contents">
                      <div className="flex justify-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="hidden md:block h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="hidden lg:block h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="flex justify-center">
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="container mx-auto py-6 sm:py-8" id="main-content">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-theme mb-2 px-4 sm:px-0">
            Your Favorite Countries
          </h1>
          <p className="text-muted text-sm sm:text-base px-4 sm:px-0">
            {favoriteCountries.length === 0 
              ? "You haven't added any countries to your favorites yet. Start exploring to add some!"
              : `You have ${favoriteCountries.length} favorite ${favoriteCountries.length === 1 ? 'country' : 'countries'}`
            }
          </p>
        </div>

        {favoriteCountries.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="text-6xl mb-4" role="img" aria-label="Heart emoji">💙</div>
            <h2 className="text-xl font-semibold text-theme mb-2">No favorites yet</h2>
            <p className="text-muted mb-6 max-w-md mx-auto">
              Discover amazing countries and add them to your favorites by clicking the heart icon.
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <CountryList countries={favoriteCountries} />
        )}
      </main>
    </ProtectedRoute>
  );
} 