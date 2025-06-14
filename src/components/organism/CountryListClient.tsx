'use client';

import { useMemo, useState, useEffect } from 'react';
import CountryList from '@/components/organism/CountryList';
import SearchAndFilter from '@/components/molecules/SearchAndFilter';
import { Country } from '@/types';
import useCountriesStore from '@/lib/countries-store';

interface CountryListClientProps {
  countries: Country[];
}

export default function CountryListClient({ countries }: CountryListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  // Store countries in cache for client-side features
  const { setAllCountries } = useCountriesStore();
  
  // Set countries in store on component mount (client-side hydration)
  useEffect(() => {
    if (countries && countries.length > 0) {
      setAllCountries(countries);
    }
  }, [countries, setAllCountries]);

  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const matchesSearch = country.name.common
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === '' || country.region === selectedRegion;
      
      return matchesSearch && matchesRegion;
    });
  }, [countries, searchTerm, selectedRegion]);

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