import { Suspense } from 'react';
import { Country } from '@/types';
import CountryListClient from '@/components/organism/CountryListClient';

async function getCountries(): Promise<Country[]> {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,cca2', {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format received from API');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

export default async function HomePage() {
  const countries = await getCountries();

  return (
    <main className="container mx-auto py-6 sm:py-8" id="main-content">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-theme mb-2 px-4 sm:px-0">
          Explore Countries
        </h1>
        <p className="text-muted text-sm sm:text-base px-4 sm:px-0">
          Discover detailed information about countries around the world
        </p>
      </div>

      <Suspense fallback={<div>Loading countries...</div>}>
        <CountryListClient countries={countries} />
      </Suspense>
    </main>
  );
}