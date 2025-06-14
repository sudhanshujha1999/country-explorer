'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CountryDetail } from '@/types';
import useFavoriteStore from '@/lib/store';
import useAuthStore from '@/lib/auth-store';

interface CountryDetailClientProps {
  countryData: CountryDetail;
  borderCountries: { [key: string]: string };
}

export default function CountryDetailClient({ countryData, borderCountries }: CountryDetailClientProps) {
  const router = useRouter();
  const [country] = useState<CountryDetail>(countryData);

  const { favorites, toggleFavorite } = useFavoriteStore();
  const { isAuthenticated } = useAuthStore();

  const isFavorite = country ? favorites.includes(country.cca2) : false;

  const handleFavoriteToggle = () => {
    if (!isAuthenticated || !country) return;
    toggleFavorite(country.cca2, country.name.common);
  };

  if (!country) {
    return (
      <main className="container mx-auto py-8 px-4">
        <button 
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 cursor-pointer border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md transition-all duration-200 flex items-center gap-2 font-medium hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Go back to previous page"
        >
          ← Back
        </button>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center" role="alert">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Country Not Found
          </h1>
          <p className="text-gray-800 dark:text-gray-300">
            The requested country could not be found.
          </p>
        </div>
      </main>
    );
  }

  const nativeNames = country.name.nativeName ? Object.values(country.name.nativeName) : [];
  const currencies = country.currencies ? Object.values(country.currencies) : [];
  const languages = country.languages ? Object.values(country.languages) : [];

  return (
    <main className="relative">
      <button 
        onClick={() => router.back()}
        className="absolute cursor-pointer top-4 left-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Go back to previous page"
        title="Go back"
      >
        <ArrowLeftIcon className="w-5 h-5" aria-hidden="true" />
      </button>

      <div className="container mx-auto px-0 md:px-4 md:py-16">
        <article className="bg-white dark:bg-gray-800 shadow-lg sm:rounded-lg overflow-hidden relative">
          {isAuthenticated && (
            <button 
              onClick={handleFavoriteToggle}
              className="absolute cursor-pointer top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={isFavorite 
                ? `Remove ${country.name.common} from favorites` 
                : `Add ${country.name.common} to favorites`
              }
              title={isFavorite 
                ? `Remove ${country.name.common} from favorites` 
                : `Add ${country.name.common} to favorites`
              }
            >
              {isFavorite ? (
                <HeartSolid className="w-6 h-6 text-red-500" aria-hidden="true" />
              ) : (
                <HeartOutline className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              )}
            </button>
          )}

          <div className="flex flex-col md:flex-row md:min-h-[600px]">
            <div className="md:w-2/5 h-48 md:h-auto bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center p-4 md:p-8">
              <div className="w-24 h-24 md:w-80 md:h-60 rounded-lg overflow-hidden border-4 border-white shadow-lg md:shadow-2xl">
                <Image
                  src={country.flags.svg}
                  alt={`Flag of ${country.name.common}`}
                  width={320}
                  height={240}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            <div className="md:w-3/5 p-4 md:p-8">
              <div className="mb-6 md:mb-8">
                <h1 className="!text-2xl md:!text-4xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
                  {country.name.common}
                </h1>
                {nativeNames.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Native Names
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {nativeNames.map(name => name.common).join(', ')}
                    </p>
                  </div>
                )}
              </div>

              <section aria-labelledby="basic-info-heading">
                <h2 id="basic-info-heading" className="sr-only">Basic Information</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Population</h3>
                    <p className="text-gray-800 dark:text-gray-300 text-lg" aria-label={`Population: ${country.population.toLocaleString()}`}>
                      {country.population.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Region and Subregion</h3>
                    <p className="text-gray-800 dark:text-gray-300">
                      {country.region}{country.subregion && `, ${country.subregion}`}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Capital</h3>
                    <p className="text-gray-800 dark:text-gray-300">
                      {country.capital?.join(', ') || 'N/A'}
                    </p>
                  </div>
                  
                  {country.tld && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Top Level Domains</h3>
                      <p className="text-gray-800 dark:text-gray-300">
                        {country.tld.join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {currencies.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Currencies</h3>
                      <p className="text-gray-800 dark:text-gray-300">
                        {currencies.map((currency: { name: string; symbol?: string }) => 
                          `${currency.name} (${currency.symbol || 'N/A'})`
                        ).join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {languages.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Languages</h3>
                      <p className="text-gray-800 dark:text-gray-300">
                        {languages.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {country.borders && country.borders.length > 0 && (
                <section aria-labelledby="border-countries-heading">
                  <h2 id="border-countries-heading" className="font-semibold text-gray-900 dark:text-white mb-4">
                    Border Countries
                  </h2>
                  <div className="flex flex-wrap gap-2" role="list" aria-label="List of neighboring countries">
                    {country.borders.map((borderCode) => (
                      <Link 
                        key={borderCode} 
                        href={`/country/${borderCode}`}
                        className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
                        role="listitem"
                        aria-label={`View details for ${borderCountries[borderCode] || borderCode}`}
                      >
                        {borderCountries[borderCode] || borderCode}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
} 