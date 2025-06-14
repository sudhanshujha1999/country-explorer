import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import CountryList from '../CountryList'
import { Country } from '@/types'

// Mock the stores
jest.mock('../../../lib/store', () => ({
  __esModule: true,
  default: () => ({
    favorites: ['US'],
    toggleFavorite: jest.fn(),
  }),
}))

// Mock auth store
jest.mock('../../../lib/auth-store', () => ({
  __esModule: true,
  default: () => ({
    isAuthenticated: true,
  }),
}))

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
]

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      {ui}
    </ThemeProvider>
  )
}

describe('CountryList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render countries list', () => {
    renderWithProviders(<CountryList countries={mockCountries} />)
    
    // Use getAllByText since country names appear in both mobile and desktop layouts
    const usElements = screen.getAllByText('United States')
    expect(usElements.length).toBeGreaterThan(0)
    
    const caElements = screen.getAllByText('Canada')
    expect(caElements.length).toBeGreaterThan(0)
  })

  it('should display "No countries found" when empty', () => {
    renderWithProviders(<CountryList countries={[]} />)
    
    expect(screen.getByText('No countries found matching your criteria.')).toBeInTheDocument()
  })

  it('should render country information correctly', () => {
    renderWithProviders(<CountryList countries={[mockCountries[0]]} />)
    
    const usElements = screen.getAllByText('United States')
    expect(usElements.length).toBeGreaterThan(0)
    
    const populationElements = screen.getAllByText('331,000,000')
    expect(populationElements.length).toBeGreaterThan(0)
    
    // Check for region using getAllByText since it appears in both mobile and desktop layouts
    const americasElements = screen.getAllByText('Americas')
    expect(americasElements.length).toBeGreaterThan(0)
  })

  it('should render country flags with correct alt text', () => {
    renderWithProviders(<CountryList countries={[mockCountries[0]]} />)
    
    const flagImages = screen.getAllByAltText('Flag of United States')
    expect(flagImages.length).toBeGreaterThan(0)
  })

  it('should show desktop table headers', () => {
    renderWithProviders(<CountryList countries={mockCountries} />)
    
    expect(screen.getByText('Flag')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Population')).toBeInTheDocument()
    expect(screen.getByText('Region')).toBeInTheDocument()
    expect(screen.getByText('Capital')).toBeInTheDocument()
    expect(screen.getByText('Favorite')).toBeInTheDocument()
  })

  it('should render favorite buttons for authenticated users', () => {
    renderWithProviders(<CountryList countries={[mockCountries[0]]} />)
    
    const favoriteButtons = screen.getAllByRole('button')
    expect(favoriteButtons.length).toBeGreaterThan(0)
  })

  it('should show filled heart for favorited countries', () => {
    renderWithProviders(<CountryList countries={[mockCountries[0]]} />)
    
    // US is in favorites (mocked), so should show filled heart
    const favoriteButtons = screen.getAllByLabelText('Remove United States from favorites')
    expect(favoriteButtons.length).toBeGreaterThan(0)
  })

  it('should show outline heart for non-favorited countries', () => {
    renderWithProviders(<CountryList countries={[mockCountries[1]]} />)
    
    // CA is not in favorites (mocked), so should show outline heart
    const favoriteButtons = screen.getAllByLabelText('Add Canada to favorites')
    expect(favoriteButtons.length).toBeGreaterThan(0)
  })

  it('should render countries as links when authenticated', () => {
    renderWithProviders(<CountryList countries={[mockCountries[0]]} />)
    
    const countryLink = screen.getByLabelText('View details for United States')
    expect(countryLink).toBeInTheDocument()
    expect(countryLink).toHaveAttribute('href', '/country/US')
  })

  it('should handle countries without capital gracefully', () => {
    const countryWithoutCapital: Country = {
      ...mockCountries[0],
      capital: [],
    }
    
    renderWithProviders(<CountryList countries={[countryWithoutCapital]} />)
    
    const naElements = screen.getAllByText('N/A')
    expect(naElements.length).toBeGreaterThan(0)
  })

  it('should have proper accessibility attributes', () => {
    renderWithProviders(<CountryList countries={mockCountries} />)
    
    const favoriteButtons = screen.getAllByRole('button')
    expect(favoriteButtons.length).toBeGreaterThan(0)
    
    favoriteButtons.forEach(button => {
      expect(button).toHaveAttribute('aria-label')
    })
  })

  it('should accept onUnauthenticatedClick callback prop', () => {
    const mockOnUnauthenticatedClick = jest.fn();
    
    renderWithProviders(
      <CountryList 
        countries={[mockCountries[0]]} 
        onUnauthenticatedClick={mockOnUnauthenticatedClick}
      />
    );
    
    // Just verify the component renders without errors when the prop is provided
    expect(screen.getAllByText('United States').length).toBeGreaterThan(0);
  });

  it('should render without onUnauthenticatedClick callback', () => {
    renderWithProviders(<CountryList countries={[mockCountries[0]]} />);
    
    // Verify the component renders without errors when the prop is not provided
    expect(screen.getAllByText('United States').length).toBeGreaterThan(0);
  });
}) 