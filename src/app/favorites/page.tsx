'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/molecules/ProtectedRoute';
import CountryList from '@/components/organism/CountryList';
import useFavoriteStore from '@/lib/store';
import useCountriesStore from '@/lib/countries-store';
import { Country } from '@/types';
import { handleApiError } from '@/lib/api-utils';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favoriteCountries, setFavoriteCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const { favorites } = useFavoriteStore();
  const { 
    allCountries, 
    allCountriesLoaded, 
    setAllCountries 
  } = useCountriesStore();

  useEffect(() => {
    const fetchFavoriteCountries = async () => {
      if (favorites.length === 0) {
        setFavoriteCountries([]);
        return;
      }

      // If we have all countries cached, use them
      if (allCountriesLoaded && allCountries.length > 0) {
        const filteredCountries = allCountries.filter(country => 
          favorites.includes(country.cca2)
        );
        setFavoriteCountries(filteredCountries);
        return;
      }

      // Otherwise, fetch all countries and cache them
      setLoading(true);
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca2');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allCountriesData = await response.json() as Country[];
        setAllCountries(allCountriesData);
        
        const filteredCountries = allCountriesData.filter(country => 
          favorites.includes(country.cca2)
        );
        setFavoriteCountries(filteredCountries);
      } catch (error) {
        handleApiError(error, 'Failed to load favorite countries. Please try again later.');
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
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your favorite countries...</p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Favorite Countries</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {favoriteCountries.length === 0 
              ? "You haven't added any countries to your favorites yet. Start exploring to add some!"
              : `You have ${favoriteCountries.length} favorite ${favoriteCountries.length === 1 ? 'country' : 'countries'}.`
            }
          </p>
        </div>

        {favoriteCountries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No favorite countries yet.</p>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Explore Countries
            </Link>
          </div>
        ) : (
          <CountryList countries={favoriteCountries} />
        )}
      </main>
    </ProtectedRoute>
  );
} 