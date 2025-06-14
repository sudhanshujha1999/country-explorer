import CountryList from '@/components/organism/CountryList';
import { Country } from '@/types';
import axios from 'axios';

async function getCountries() {
  const { data } = await axios.get('https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca2');
  return data;
}

export default async function Home() {
  const countries = await getCountries();

  return (
    <main className="container mx-auto py-8">
      <CountryList countries={countries as Country[] || []} />
    </main>
  );
}