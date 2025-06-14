"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import useFavoriteStore from '@/lib/store';
import useAuthStore from '@/lib/auth-store';
import { Country } from '@/types';

interface CountryListProps {
  countries: Country[];
}

const CountryList: React.FC<CountryListProps> = ({ countries }) => {
  const { favorites, toggleFavorite } = useFavoriteStore();
  const { isAuthenticated } = useAuthStore();

  if (countries.length === 0) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <p className="text-muted text-lg">No countries found matching your criteria.</p>
      </div>
    );
  }

  const CountryRow = ({ country }: { country: Country }) => {
    const isFavorite = favorites.includes(country.cca2);
    
    const content = (
      <div className="grid grid-cols-6 gap-4 p-4 hover:bg-accent/10 transition-colors items-center focus-within:bg-accent/10">
        {/* Flag */}
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-theme">
            <Image
              src={country.flags.svg}
              alt={`Flag of ${country.name.common}`}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name */}
        <div className="text-theme">
          <div className="truncate" title={country.name.common}>
            {country.name.common}
          </div>
          {/* Mobile: Show additional info below name */}
          <div className="sm:hidden text-sm text-muted mt-1">
            <div aria-label={`Population: ${country.population.toLocaleString()}`}>
              {country.population.toLocaleString()}
            </div>
            <div aria-label={`Region: ${country.region}, Capital: ${country.capital?.[0] || 'N/A'}`}>
              {country.region} • {country.capital?.[0] || 'N/A'}
            </div>
          </div>
        </div>

        {/* Population - Hidden on mobile */}
        <div className="hidden sm:block text-theme">
          <div 
            className="truncate" 
            title={`Population: ${country.population.toLocaleString()}`}
            aria-label={`Population: ${country.population.toLocaleString()}`}
          >
            {country.population.toLocaleString()}
          </div>
        </div>

        {/* Region - Hidden on mobile and small tablets */}
        <div className="hidden md:block text-theme">
          <div 
            className="truncate" 
            title={`Region: ${country.region}`}
            aria-label={`Region: ${country.region}`}
          >
            {country.region}
          </div>
        </div>

        {/* Capital - Hidden on mobile and tablets */}
        <div className="hidden lg:block text-theme">
          <div 
            className="truncate" 
            title={`Capital: ${country.capital?.[0] || 'N/A'}`}
            aria-label={`Capital: ${country.capital?.[0] || 'N/A'}`}
          >
            {country.capital?.[0] || 'N/A'}
          </div>
        </div>

        {/* Favorite */}
        <div className="flex justify-center">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(country.cca2, country.name.common);
            }}
            className="p-1 rounded-full hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
              <HeartOutline className="w-6 h-6 text-muted" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    );

    if (isAuthenticated) {
      return (
        <Link 
          href={`/country/${country.cca2}`} 
          key={country.cca2}
          className="block border-b border-theme hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors"
          aria-label={`View details for ${country.name.common}`}
        >
          {content}
        </Link>
      );
    }

    return (
      <div 
        key={country.cca2} 
        className="border-b border-theme"
        role="row"
        aria-label={`${country.name.common} - Population: ${country.population.toLocaleString()}, Region: ${country.region}, Capital: ${country.capital?.[0] || 'N/A'}`}
      >
        {content}
      </div>
    );
  };

  return (
    <section aria-label="Countries list">
      <div className="bg-theme border border-theme rounded-lg overflow-hidden" role="table" aria-label="Countries information table">
        {/* Header */}
        <div 
          className="grid grid-cols-6 gap-4 p-4 border-b border-theme font-medium text-theme bg-accent/5"
          role="row"
          aria-label="Table headers"
        >
          <div className="text-center" role="columnheader" aria-label="Country flag">Flag</div>
          <div role="columnheader" aria-label="Country name">Name</div>
          <div className="hidden sm:block" role="columnheader" aria-label="Population">Population</div>
          <div className="hidden md:block" role="columnheader" aria-label="Region">Region</div>
          <div className="hidden lg:block" role="columnheader" aria-label="Capital city">Capital</div>
          <div className="text-center" role="columnheader" aria-label="Add to favorites">Favorite</div>
        </div>

        {/* Country Rows */}
        <div className="divide-y divide-theme" role="rowgroup">
          {countries.map((country) => (
            <CountryRow key={country.cca2} country={country} />
          ))}
        </div>
      </div>
      
      {/* Screen reader summary */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing {countries.length} {countries.length === 1 ? 'country' : 'countries'}
      </div>
    </section>
  );
};

export default CountryList;
