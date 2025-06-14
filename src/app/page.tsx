import CountryListClient from '@/components/organism/CountryListClient';
import { Country } from '@/types';

async function getCountries(): Promise<Country[]> {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca2', {
      next: { revalidate: 86400 } // Revalidate every 24 hours (ISR)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching countries for SSG:', error);
    return [];
  }
}

export default async function Home() {
  const countries = await getCountries();

  return (
    <main className="container mx-auto py-8">
      <CountryListClient countries={countries} />
    </main>
  );
}