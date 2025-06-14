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
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full border border-theme rounded-md py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-theme text-theme"
        />
        <MagnifyingGlassIcon className="w-5 h-5 text-muted absolute left-4 top-1/2 transform -translate-y-1/2" />
      </div>

      {/* Region Filter */}
      <div className="relative">
        <select
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          className="appearance-none border border-theme rounded-md py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-theme text-theme min-w-[200px]"
        >
          {regions.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="w-5 h-5 text-muted absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

export default SearchAndFilter; 