'use client';

import { useState, useEffect, useMemo } from 'react';
import CountryList from '@/components/organism/CountryList';
import SearchAndFilter from '@/components/molecules/SearchAndFilter';
import { Country } from '@/types';
import axios from 'axios';

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await axios.get('https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca2');
        setCountries(data as Country[]);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const matchesSearch = country.name.common
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === '' || country.region === selectedRegion;
      
      return matchesSearch && matchesRegion;
    });
  }, [countries, searchTerm, selectedRegion]);

  if (loading) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-muted text-lg">Loading countries...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8">
      <SearchAndFilter
        searchTerm={searchTerm}
        selectedRegion={selectedRegion}
        onSearchChange={setSearchTerm}
        onRegionChange={setSelectedRegion}
      />
      <CountryList countries={filteredCountries} />
    </main>
  );
}