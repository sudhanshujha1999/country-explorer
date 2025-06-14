import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Country } from '@/types';

interface CountriesState {
    // All countries for the main list (homepage)
    allCountries: Country[];
    allCountriesLoaded: boolean;

    // Actions
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
            // Only persist the countries list data
            partialize: (state) => ({
                allCountries: state.allCountries,
                allCountriesLoaded: state.allCountriesLoaded
            })
        }
    )
);

export default useCountriesStore; 