'use client';

import React from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface SearchAndFilterProps {
  searchTerm: string;
  selectedRegion: string;
  onSearchChange: (value: string) => void;
  onRegionChange: (value: string) => void;
}

const regions = [
  { value: '', label: 'All Regions' },
  { value: 'Africa', label: 'Africa' },
  { value: 'Americas', label: 'Americas' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Oceania', label: 'Oceania' },
];

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  selectedRegion,
  onSearchChange,
  onRegionChange,
}) => {
  return (
    <section className="mb-6" role="search" aria-label="Search and filter countries">
      <div className="px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <label htmlFor="country-search" className="sr-only">
              Search for a country by name
            </label>
            <input
              id="country-search"
              type="text"
              placeholder="Search for a country..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full border border-theme rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-theme text-theme text-base transition-colors"
              aria-describedby="search-description"
              autoComplete="off"
            />
            <MagnifyingGlassIcon 
              className="w-5 h-5 text-muted absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" 
              aria-hidden="true"
            />
            <div id="search-description" className="sr-only">
              Type to search countries by name. Results will update automatically as you type.
            </div>
          </div>

          <div className="relative sm:w-64">
            <label htmlFor="region-filter" className="sr-only">
              Filter countries by region
            </label>
            <select
              id="region-filter"
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
              className="appearance-none border border-theme rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-theme text-theme w-full text-base transition-colors"
              aria-describedby="filter-description"
            >
              {regions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon 
              className="w-5 h-5 text-muted absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" 
              aria-hidden="true"
            />
            <div id="filter-description" className="sr-only">
              Select a region to filter countries. Choose &quot;All Regions&quot; to show all countries.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchAndFilter; 