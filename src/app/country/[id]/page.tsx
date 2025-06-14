import { Suspense } from 'react';
import LoadingSkeleton from './loading';
import CountryDetailClient from './CountryDetailClient';
import { CountryDetail } from '@/types';

// Helper function to fetch country data with border country names in one call
async function getCountryDataWithBorders(countryCode: string): Promise<{
  countryData: CountryDetail | null;
  borderCountries: { [key: string]: string };
}> {
  try {
    // Fetch the main country data
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`, {
      next: { revalidate: 604800 } // Revalidate weekly (7 days)
    });
    
    if (!response.ok) {
      return { countryData: null, borderCountries: {} };
    }
    
    const data = await response.json();
    const countryData = data[0];
    
    // If country has borders, fetch border country names in the same request cycle
    let borderCountries: { [key: string]: string } = {};
    
    if (countryData.borders && countryData.borders.length > 0) {
      try {
        const borderCodes = countryData.borders.join(',');
        const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}&fields=cca2,name`, {
          next: { revalidate: 604800 } // Revalidate weekly
        });
        
        if (borderResponse.ok) {
          const borderCountriesData = await borderResponse.json();
          const borderNamesMap: { [key: string]: string } = {};
          borderCountriesData.forEach((borderCountry: { cca2: string; name: { common: string } }) => {
            borderNamesMap[borderCountry.cca2] = borderCountry.name.common;
          });
          borderCountries = borderNamesMap;
        } else {
          // Fallback to showing country codes
          const fallbackMap: { [key: string]: string } = {};
          countryData.borders.forEach((code: string) => {
            fallbackMap[code] = code;
          });
          borderCountries = fallbackMap;
        }
      } catch (borderError) {
        console.error('Error fetching border country names:', borderError);
        // Fallback to showing country codes
        const fallbackMap: { [key: string]: string } = {};
        countryData.borders.forEach((code: string) => {
          fallbackMap[code] = code;
        });
        borderCountries = fallbackMap;
      }
    }
    
    return { countryData, borderCountries };
  } catch (error) {
    console.error('Error fetching country data:', error);
    return { countryData: null, borderCountries: {} };
  }
}

// No pre-generation - let pages be generated on-demand
// This will create pages dynamically when visited and cache them with ISR
export async function generateStaticParams() {
  // Return empty array - no pre-generation
  // Pages will be generated on-demand when users visit them
  return [];
}

interface CountryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CountryDetailPage({ params }: CountryDetailPageProps) {
  const { id } = await params;
  
  // Fetch country data and border countries in one function call
  const { countryData, borderCountries } = await getCountryDataWithBorders(id);
  
  if (!countryData) {
    return (
      <main className="container mx-auto py-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Country Not Found
          </h1>
          <p className="text-gray-800 dark:text-gray-300">
            The requested country could not be found.
          </p>
        </div>
      </main>
    );
  }
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CountryDetailClient 
        countryData={countryData} 
        borderCountries={borderCountries}
      />
    </Suspense>
  );
}

// Enable ISR for all countries - pages generated on-demand and cached
export const dynamicParams = true; 