import { Suspense } from 'react';
import LoadingSkeleton from './loading';
import CountryDetailClient from './CountryDetailClient';
import { CountryDetail } from '@/types';

async function getCountryDataWithBorders(countryCode: string): Promise<{
  countryData: CountryDetail | null;
  borderCountries: { [key: string]: string };
}> {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`, {
      next: { revalidate: 604800 }
    });
    
    if (!response.ok) {
      return { countryData: null, borderCountries: {} };
    }
    
    const data = await response.json();
    const countryData = data[0];
    
    let borderCountries: { [key: string]: string } = {};
    
    if (countryData.borders && countryData.borders.length > 0) {
      try {
        const borderCodes = countryData.borders.join(',');
        const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}&fields=cca2,name`, {
          next: { revalidate: 604800 }
        });
        
        if (borderResponse.ok) {
          const borderCountriesData = await borderResponse.json();
          const borderNamesMap: { [key: string]: string } = {};
          borderCountriesData.forEach((borderCountry: { cca2: string; name: { common: string } }) => {
            borderNamesMap[borderCountry.cca2] = borderCountry.name.common;
          });
          borderCountries = borderNamesMap;
        } else {
          const fallbackMap: { [key: string]: string } = {};
          countryData.borders.forEach((code: string) => {
            fallbackMap[code] = code;
          });
          borderCountries = fallbackMap;
        }
      } catch (borderError) {
        console.error('Error fetching border country names:', borderError);
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

export async function generateStaticParams() {
  return [];
}

interface CountryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CountryDetailPage({ params }: CountryDetailPageProps) {
  const { id } = await params;
  
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

export const dynamicParams = true; 