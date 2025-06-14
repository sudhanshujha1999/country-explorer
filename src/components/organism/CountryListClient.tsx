'use client';

import { useMemo, useState, useEffect } from 'react';
import CountryList from '@/components/organism/CountryList';
import SearchAndFilter from '@/components/molecules/SearchAndFilter';
import { Country } from '@/types';
import useCountriesStore from '@/lib/countries-store';
import { useSnackbar } from 'notistack';

interface CountryListClientProps {
  countries: Country[];
}

export default function CountryListClient({ countries }: CountryListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  // Store countries in cache for client-side features
  const { setAllCountries } = useCountriesStore();
  
  // Set countries in store on component mount (client-side hydration)
  useEffect(() => {
    if (countries && countries.length > 0) {
      setAllCountries(countries);
    } else if (countries.length === 0) {
      // Show error notification if no countries were loaded
      enqueueSnackbar(
        'Failed to load countries. Please refresh the page to try again.',
        { 
          variant: 'error',
          autoHideDuration: 5000,
        }
      );
    }
  }, [countries, setAllCountries, enqueueSnackbar]);

  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const matchesSearch = country.name.common
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === '' || country.region === selectedRegion;
      
      return matchesSearch && matchesRegion;
    });
  }, [countries, searchTerm, selectedRegion]);

  // Show error state if no countries loaded
  if (countries.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-6xl mb-4" role="img" aria-label="Error emoji">⚠️</div>
        <h2 className="text-xl font-semibold text-theme mb-2">Unable to Load Countries</h2>
        <p className="text-muted mb-6 max-w-md mx-auto">
          We're having trouble loading the countries data. Please check your internet connection and try again.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <>
      <SearchAndFilter
        searchTerm={searchTerm}
        selectedRegion={selectedRegion}
        onSearchChange={setSearchTerm}
        onRegionChange={setSelectedRegion}
      />
      <CountryList countries={filteredCountries} />
    </>
  );
} 