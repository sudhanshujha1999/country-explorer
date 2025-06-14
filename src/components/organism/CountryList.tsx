"use client";
import React from 'react';
import Image from 'next/image';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import useFavoriteStore from '@/lib/store';
import { Country } from '@/types';

interface CountryListProps {
  countries: Country[];
}

const CountryList: React.FC<CountryListProps> = ({ countries }) => {
  const { favorites, toggleFavorite } = useFavoriteStore();

  if (countries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted text-lg">No countries found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-theme shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 p-4 border-b border-theme font-medium text-theme bg-accent/5">
        <div className="text-center">Flag</div>
        <div>Name</div>
        <div className="hidden sm:block">Population</div>
        <div className="hidden md:block">Region</div>
        <div className="hidden lg:block">Capital</div>
        <div className="text-center">Favorite</div>
      </div>

      {/* Country Rows */}
      <div className="divide-y divide-theme">
        {countries.map((country) => (
          <div
            key={country.cca2}
            className="grid grid-cols-6 border-b border-theme gap-4 p-4 hover:bg-accent/10 transition-colors items-center"
          >
            {/* Flag */}
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-theme">
                <Image
                  src={country.flags.svg}
                  alt={`${country.name.common} flag`}
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
                <div>{country.population.toLocaleString()}</div>
                <div>{country.region} • {country.capital?.[0] || 'N/A'}</div>
              </div>
            </div>

            {/* Population - Hidden on mobile */}
            <div className="hidden sm:block text-theme">
              <div className="truncate" title={country.population.toLocaleString()}>
                {country.population.toLocaleString()}
              </div>
            </div>

            {/* Region - Hidden on mobile and small tablets */}
            <div className="hidden md:block text-theme">
              <div className="truncate" title={country.region}>
                {country.region}
              </div>
            </div>

            {/* Capital - Hidden on mobile and tablets */}
            <div className="hidden lg:block text-theme">
              <div className="truncate" title={country.capital?.[0] || 'N/A'}>
                {country.capital?.[0] || 'N/A'}
              </div>
            </div>

            {/* Favorite */}
            <div className="flex justify-center">
              <button onClick={() => toggleFavorite(country.cca2)}>
                {favorites.includes(country.cca2) ? (
                  <HeartSolid className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartOutline className="w-6 h-6 text-muted" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryList;
