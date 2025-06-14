import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Country } from '@/types';

interface CountriesState {
    allCountries: Country[];
    allCountriesLoaded: boolean;
    setAllCountries: (countries: Country[]) => void;
    getCountryFromList: (countryCode: string) => Country | undefined;
    clearCache: () => void;
}

const useCountriesStore = create<CountriesState>()(
    persist(
        (set, get) => ({
            allCountries: [],
            allCountriesLoaded: false,

            setAllCountries: (countries) =>
                set({ allCountries: countries, allCountriesLoaded: true }),

            getCountryFromList: (countryCode) => {
                const { allCountries } = get();
                return allCountries.find(country => country.cca2 === countryCode);
            },

            clearCache: () =>
                set({
                    allCountries: [],
                    allCountriesLoaded: false
                })
        }),
        {
            name: 'countries-list-cache',
            partialize: (state) => ({
                allCountries: state.allCountries,
                allCountriesLoaded: state.allCountriesLoaded
            })
        }
    )
);

export default useCountriesStore; 