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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="text-left border-b">
            <th className="p-4">Flag</th>
            <th className="p-4">Name</th>
            <th className="p-4">Population</th>
            <th className="p-4">Region</th>
            <th className="p-4">Capital</th>
            <th className="p-4">Favorite</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country.cca2} className="border-b">
              <td className="p-4">
                <Image
                  src={country.flags.svg}
                  alt={`${country.name.common} flag`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </td>
              <td className="p-4">{country.name.common}</td>
              <td className="p-4">{country.population.toLocaleString()}</td>
              <td className="p-4">{country.region}</td>
              <td className="p-4">{country.capital?.[0]}</td>
              <td className="p-4">
                <button onClick={() => toggleFavorite(country.cca2)}>
                  {favorites.includes(country.cca2) ? (
                    <HeartSolid className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartOutline className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CountryList;
