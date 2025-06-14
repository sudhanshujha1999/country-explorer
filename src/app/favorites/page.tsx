'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CountryList from '@/components/organism/CountryList';
import ProtectedRoute from '@/components/molecules/ProtectedRoute';
import useFavoriteStore from '@/lib/store';
import useCountriesStore from '@/lib/countries-store';
import { Country } from '@/types';
import { handleApiError } from '@/lib/api-utils';

export default function FavoritesPage() {
  const { favorites } = useFavoriteStore();
  const { allCountries, allCountriesLoaded, setAllCountries } = useCountriesStore();
  const [loading, setLoading] = useState(true);
  const [favoriteCountries, setFavoriteCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchFavoriteCountries = async () => {
      if (favorites.length === 0) {
        setFavoriteCountries([]);
        setLoading(false);
        return;
      }

      try {
        // If we already have all countries loaded, filter from cache
        if (allCountriesLoaded && allCountries.length > 0) {
          const filtered = allCountries.filter(country => 
            favorites.includes(country.cca2)
          );
          setFavoriteCountries(filtered);
          setLoading(false);
          return;
        }

        // Otherwise, fetch all countries first
        setLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,cca2');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const countries: Country[] = await response.json();
        
        // Store in cache
        setAllCountries(countries);
        
        // Filter favorites
        const filtered = countries.filter(country => 
          favorites.includes(country.cca2)
        );
        setFavoriteCountries(filtered);
      } catch (error) {
        console.error('Error fetching favorite countries:', error);
        handleApiError(error, 'Failed to load favorite countries');
        setFavoriteCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteCountries();
  }, [favorites, allCountries, allCountriesLoaded, setAllCountries]);

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="container mx-auto py-8">
          <div className="text-center py-12" role="status" aria-live="polite">
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your favorite countries...</p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="container mx-auto py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Favorite Countries
          </h1>
          <p className="text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
            {favoriteCountries.length === 0 
              ? "You haven't added any countries to your favorites yet. Start exploring to add some!"
              : `You have ${favoriteCountries.length} favorite ${favoriteCountries.length === 1 ? 'country' : 'countries'}.`
            }
          </p>
        </header>

        {favoriteCountries.length === 0 ? (
          <section className="text-center py-12" aria-labelledby="empty-state-heading">
            <h2 id="empty-state-heading" className="sr-only">No favorite countries</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No favorite countries yet.
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              aria-label="Go to explore countries page to start adding favorites"
            >
              Explore Countries
            </Link>
          </section>
        ) : (
          <section aria-labelledby="favorites-list-heading">
            <h2 id="favorites-list-heading" className="sr-only">Your favorite countries</h2>
            <CountryList countries={favoriteCountries} />
          </section>
        )}
      </main>
    </ProtectedRoute>
  );
} 