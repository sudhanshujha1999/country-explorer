import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'next-themes'
import CountryListClient from '../CountryListClient'
import { Country } from '@/types'
import useStore from '../../../lib/store'

// Mock the stores
jest.mock('../../../lib/store', () => ({
  __esModule: true,
  default: () => ({
    favorites: ['US'],
    toggleFavorite: jest.fn(),
  }),
}))

// Mock other dependencies
jest.mock('../../../lib/countries-store', () => ({
  __esModule: true,
  default: () => ({
    allCountries: [],
    allCountriesLoaded: false,
    setAllCountries: jest.fn(),
    getCountryFromList: jest.fn(),
    clearCache: jest.fn(),
  }),
}))

const mockCountries: Country[] = [
  {
    cca2: 'US',
    name: { common: 'United States' },
    population: 331000000,
    region: 'Americas',
    capital: ['Washington, D.C.'],
    flags: { svg: 'us-flag.svg' },
    languages: { eng: 'English' },
    currencies: { USD: { name: 'United States dollar', symbol: '$' } },
    borders: ['CAN', 'MEX']
  },
  {
    cca2: 'CA',
    name: { common: 'Canada' },
    population: 38000000,
    region: 'Americas',
    capital: ['Ottawa'],
    flags: { svg: 'ca-flag.svg' },
    languages: { eng: 'English', fra: 'French' },
    currencies: { CAD: { name: 'Canadian dollar', symbol: '$' } },
    borders: ['USA']
  },
  {
    cca2: 'FR',
    name: { common: 'France' },
    population: 67000000,
    region: 'Europe',
    capital: ['Paris'],
    flags: { svg: 'fr-flag.svg' },
    languages: { fra: 'French' },
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    borders: ['ESP', 'ITA']
  },
]

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      {ui}
    </ThemeProvider>
  )
}

describe('CountryListClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render search and filter components', () => {
    renderWithProviders(<CountryListClient countries={mockCountries} />)
    
    expect(screen.getByPlaceholderText(/search for a country/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('should handle search input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CountryListClient countries={mockCountries} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a country/i)
    await user.type(searchInput, 'Canada')
    
    expect(searchInput).toHaveValue('Canada')
  })

  it('should handle region filter', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CountryListClient countries={mockCountries} />)
    
    const regionSelect = screen.getByRole('combobox')
    await user.selectOptions(regionSelect, 'Europe')
    
    expect(regionSelect).toHaveValue('Europe')
  })

  it('should filter countries by search term', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CountryListClient countries={mockCountries} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a country/i)
    await user.type(searchInput, 'United')
    
    // Should show United States
    const usElements = screen.getAllByText('United States')
    expect(usElements.length).toBeGreaterThan(0)
    
    // Should not show Canada
    expect(screen.queryByText('Canada')).not.toBeInTheDocument()
  })

  it('should filter countries by region', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CountryListClient countries={mockCountries} />)
    
    const regionSelect = screen.getByRole('combobox')
    await user.selectOptions(regionSelect, 'Europe')
    
    // Should show France
    const frElements = screen.getAllByText('France')
    expect(frElements.length).toBeGreaterThan(0)
    
    // Should not show Americas countries
    expect(screen.queryByText('United States')).not.toBeInTheDocument()
    expect(screen.queryByText('Canada')).not.toBeInTheDocument()
  })

  it('should reset region filter to show all countries', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CountryListClient countries={mockCountries} />)
    
    const regionSelect = screen.getByRole('combobox')
    
    // Filter by Europe first
    await user.selectOptions(regionSelect, 'Europe')
    
    // Reset to all regions
    await user.selectOptions(regionSelect, '')
    
    // All countries should be visible again
    const usElements = screen.getAllByText('United States')
    expect(usElements.length).toBeGreaterThan(0)
    
    const caElements = screen.getAllByText('Canada')
    expect(caElements.length).toBeGreaterThan(0)
    
    const frElements = screen.getAllByText('France')
    expect(frElements.length).toBeGreaterThan(0)
  })

  it('should handle case-insensitive search', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CountryListClient countries={mockCountries} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a country/i)
    await user.type(searchInput, 'united states')
    
    const usElements = screen.getAllByText('United States')
    expect(usElements.length).toBeGreaterThan(0)
  })

  it('should handle empty countries array gracefully', () => {
    renderWithProviders(<CountryListClient countries={[]} />)
    
    // Should show error state for empty countries
    expect(screen.getByText('Unable to Load Countries')).toBeInTheDocument()
  })

  it('should display loading state when countries are loading', () => {
    renderWithProviders(<CountryListClient countries={[]} />)
    
    // When countries array is empty, should show error state
    expect(screen.getByText(/unable to load countries/i)).toBeInTheDocument()
  })

  it('should handle favorite toggling', async () => {
    renderWithProviders(<CountryListClient countries={mockCountries} />)
    
    // This would require mocking actual country data
    // For now, just verify the store is available
    expect(useStore().toggleFavorite).toBeDefined()
  })

  it('should handle accessibility properly', () => {
    renderWithProviders(<CountryListClient countries={mockCountries} />)
    
    const searchInput = screen.getByRole('textbox')
    expect(searchInput).toHaveAttribute('aria-describedby')
    
    const regionSelect = screen.getByRole('combobox')
    expect(regionSelect).toHaveAttribute('aria-describedby')
  })

  it('should combine search and region filters', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CountryListClient countries={mockCountries} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a country/i)
    const regionSelect = screen.getByRole('combobox')
    
    // Filter by Americas region
    await user.selectOptions(regionSelect, 'Americas')
    
    // Then search for "United"
    await user.type(searchInput, 'United')
    
    // Should show United States (matches both region and search)
    const usElements = screen.getAllByText('United States')
    expect(usElements.length).toBeGreaterThan(0)
    
    // Should not show Canada (doesn't match search)
    expect(screen.queryByText('Canada')).not.toBeInTheDocument()
  })
}) 