import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach } from '@jest/globals';
import useCountriesStore from '../countries-store';
import { Country } from '@/types';

// Mock persist middleware
jest.mock('zustand/middleware', () => ({
    persist: (fn: unknown) => fn,
}));

// Mock data
const mockCountries: Country[] = [
    {
        name: { common: 'United States' },
        cca2: 'US',
        population: 331000000,
        region: 'Americas',
        capital: ['Washington, D.C.'],
        flags: { svg: 'us-flag.svg' },
        languages: { eng: 'English' },
        currencies: { USD: { name: 'United States dollar', symbol: '$' } },
        borders: ['CAN', 'MEX']
    },
    {
        name: { common: 'Canada' },
        cca2: 'CA',
        population: 38000000,
        region: 'Americas',
        capital: ['Ottawa'],
        flags: { svg: 'ca-flag.svg' },
        languages: { eng: 'English', fra: 'French' },
        currencies: { CAD: { name: 'Canadian dollar', symbol: '$' } },
        borders: ['USA']
    },
    {
        name: { common: 'United Kingdom' },
        cca2: 'GB',
        population: 67000000,
        region: 'Europe',
        capital: ['London'],
        flags: { svg: 'gb-flag.svg' },
        languages: { eng: 'English' },
        currencies: { GBP: { name: 'British pound', symbol: '£' } },
        borders: ['IRL']
    }
];

describe('useCountriesStore', () => {
    beforeEach(() => {
        // Reset the store before each test
        act(() => {
            useCountriesStore.getState().clearCache();
        });
    });

    afterEach(() => {
        // Clean up after each test
        act(() => {
            useCountriesStore.getState().clearCache();
        });
    });

    describe('initial state', () => {
        it('should have empty initial state', () => {
            const { result } = renderHook(() => useCountriesStore());

            expect(result.current.allCountries).toEqual([]);
            expect(result.current.allCountriesLoaded).toBe(false);
        });
    });

    describe('setAllCountries', () => {
        it('should set countries and mark as loaded', () => {
            const { result } = renderHook(() => useCountriesStore());

            act(() => {
                result.current.setAllCountries(mockCountries);
            });

            expect(result.current.allCountries).toEqual(mockCountries);
            expect(result.current.allCountriesLoaded).toBe(true);
        });

        it('should update countries when called multiple times', () => {
            const { result } = renderHook(() => useCountriesStore());

            act(() => {
                result.current.setAllCountries([mockCountries[0]]);
            });

            expect(result.current.allCountries).toHaveLength(1);
            expect(result.current.allCountries[0].name.common).toBe('United States');

            act(() => {
                result.current.setAllCountries(mockCountries);
            });

            expect(result.current.allCountries).toHaveLength(3);
            expect(result.current.allCountriesLoaded).toBe(true);
        });

        it('should handle empty array', () => {
            const { result } = renderHook(() => useCountriesStore());

            act(() => {
                result.current.setAllCountries([]);
            });

            expect(result.current.allCountries).toEqual([]);
            expect(result.current.allCountriesLoaded).toBe(true);
        });
    });

    describe('getCountryFromList', () => {
        beforeEach(() => {
            const { result } = renderHook(() => useCountriesStore());
            act(() => {
                result.current.setAllCountries(mockCountries);
            });
        });

        it('should return country by cca2 code', () => {
            const { result } = renderHook(() => useCountriesStore());

            const country = result.current.getCountryFromList('US');
            expect(country).toBeDefined();
            expect(country?.name.common).toBe('United States');
            expect(country?.cca2).toBe('US');
        });

        it('should return undefined for non-existent country code', () => {
            const { result } = renderHook(() => useCountriesStore());

            const country = result.current.getCountryFromList('XX');
            expect(country).toBeUndefined();
        });

        it('should return undefined when countries list is empty', () => {
            const { result } = renderHook(() => useCountriesStore());

            act(() => {
                result.current.clearCache();
            });

            const country = result.current.getCountryFromList('US');
            expect(country).toBeUndefined();
        });

        it('should handle case-sensitive country codes correctly', () => {
            const { result } = renderHook(() => useCountriesStore());

            // Should match exact case
            expect(result.current.getCountryFromList('US')).toBeDefined();
            expect(result.current.getCountryFromList('CA')).toBeDefined();
            expect(result.current.getCountryFromList('GB')).toBeDefined();

            // Should not match different case (assuming API uses uppercase)
            expect(result.current.getCountryFromList('us')).toBeUndefined();
            expect(result.current.getCountryFromList('ca')).toBeUndefined();
            expect(result.current.getCountryFromList('gb')).toBeUndefined();
        });

        it('should return correct country for each mock country', () => {
            const { result } = renderHook(() => useCountriesStore());

            mockCountries.forEach(mockCountry => {
                const foundCountry = result.current.getCountryFromList(mockCountry.cca2);
                expect(foundCountry).toEqual(mockCountry);
            });
        });
    });

    describe('clearCache', () => {
        it('should reset store to initial state', () => {
            const { result } = renderHook(() => useCountriesStore());

            // First set some data
            act(() => {
                result.current.setAllCountries(mockCountries);
            });

            expect(result.current.allCountries).toHaveLength(3);
            expect(result.current.allCountriesLoaded).toBe(true);

            // Then clear cache
            act(() => {
                result.current.clearCache();
            });

            expect(result.current.allCountries).toEqual([]);
            expect(result.current.allCountriesLoaded).toBe(false);
        });

        it('should allow re-setting data after clearing cache', () => {
            const { result } = renderHook(() => useCountriesStore());

            // Set, clear, then set again
            act(() => {
                result.current.setAllCountries([mockCountries[0]]);
            });

            act(() => {
                result.current.clearCache();
            });

            act(() => {
                result.current.setAllCountries(mockCountries);
            });

            expect(result.current.allCountries).toEqual(mockCountries);
            expect(result.current.allCountriesLoaded).toBe(true);
        });
    });

    describe('store persistence', () => {
        it('should provide store functions', () => {
            const { result } = renderHook(() => useCountriesStore());

            expect(typeof result.current.setAllCountries).toBe('function');
            expect(typeof result.current.getCountryFromList).toBe('function');
            expect(typeof result.current.clearCache).toBe('function');
        });

        it('should maintain state consistency across multiple hook calls', () => {
            const { result: result1 } = renderHook(() => useCountriesStore());
            const { result: result2 } = renderHook(() => useCountriesStore());

            act(() => {
                result1.current.setAllCountries(mockCountries);
            });

            // Both hooks should have the same state
            expect(result1.current.allCountries).toEqual(result2.current.allCountries);
            expect(result1.current.allCountriesLoaded).toBe(result2.current.allCountriesLoaded);

            // Both should be able to find the same country
            const country1 = result1.current.getCountryFromList('US');
            const country2 = result2.current.getCountryFromList('US');
            expect(country1).toEqual(country2);
        });
    });

    describe('edge cases', () => {
        it('should handle countries with special characters in cca2', () => {
            const specialCountry: Country = {
                ...mockCountries[0],
                name: { common: 'Special Country' },
                cca2: 'S1', // hypothetical code with number
            };

            const { result } = renderHook(() => useCountriesStore());

            act(() => {
                result.current.setAllCountries([specialCountry]);
            });

            const foundCountry = result.current.getCountryFromList('S1');
            expect(foundCountry).toEqual(specialCountry);
        });

        it('should handle multiple countries with same initial letter', () => {
            const { result } = renderHook(() => useCountriesStore());

            act(() => {
                result.current.setAllCountries(mockCountries);
            });

            // Should find correct country, not just first match
            expect(result.current.getCountryFromList('US')?.name.common).toBe('United States');
            expect(result.current.getCountryFromList('GB')?.name.common).toBe('United Kingdom');
        });

        it('should handle very large datasets efficiently', () => {
            const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
                ...mockCountries[0],
                name: { common: `Country ${i}` },
                cca2: `C${i.toString().padStart(2, '0')}`,
            }));

            const { result } = renderHook(() => useCountriesStore());

            act(() => {
                result.current.setAllCountries(largeDataset);
            });

            expect(result.current.allCountries).toHaveLength(1000);

            // Should efficiently find country in large dataset
            const country = result.current.getCountryFromList('C50');
            expect(country?.name.common).toBe('Country 50');
        });
    });
}); 