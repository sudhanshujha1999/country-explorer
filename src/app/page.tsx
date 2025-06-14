import { Metadata } from 'next';
import CountryListClient from '@/components/organism/CountryListClient';
import { Country } from '@/types';

export const metadata: Metadata = {
  title: 'Explore Countries - GlobeTrekker',
  description: 'Discover and explore countries from around the world. Search by name, filter by region, and learn about populations, capitals, currencies, and more.',
};

async function getCountries(): Promise<Country[]> {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,cca2', {
      next: { revalidate: 86400 } // 24 hours
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const countries = await response.json();
    return countries.sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

export default async function Home() {
  const countries = await getCountries();

  return (
    <main className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-theme mb-4">
          Explore Countries
        </h1>
        <p className="text-lg text-muted max-w-2xl">
          Discover detailed information about {countries.length} countries worldwide. 
          Search by name, filter by region, and explore populations, capitals, currencies, and more.
        </p>
      </header>
      
      <section aria-label="Country search and list">
        <CountryListClient countries={countries} />
      </section>
    </main>
  );
}