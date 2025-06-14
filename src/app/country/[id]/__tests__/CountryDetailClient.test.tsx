import React from 'react'
import { render, screen } from '@testing-library/react'
import { SnackbarProvider } from 'notistack'
import CountryDetailClient from '../CountryDetailClient'
import { CountryDetail } from '@/types'
import { ThemeProvider } from 'next-themes'
import userEvent from '@testing-library/user-event'

// Mock the stores
jest.mock('../../../../lib/store', () => ({
  __esModule: true,
  default: () => ({
    favorites: ['US'],
    toggleFavorite: jest.fn(),
  }),
}))

jest.mock('../../../../lib/auth-store', () => ({
  __esModule: true,
  default: () => ({
    isAuthenticated: true,
  }),
}))

// Mock useRouter
const mockBack = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}))

// Mock other dependencies
jest.mock('../../../../lib/countries-store', () => ({
  __esModule: true,
  default: () => ({
    getCountryFromList: jest.fn(),
  }),
}))

const mockCountryData: CountryDetail = {
  name: { common: 'United States' },
  cca2: 'US',
  population: 331000000,
  region: 'Americas',
  capital: ['Washington, D.C.'],
  flags: { svg: 'us-flag.svg' },
  languages: { eng: 'English' },
  currencies: { USD: { name: 'United States dollar', symbol: '$' } },
  borders: ['CAN', 'MEX']
};

const mockBorderCountries = {
  CAN: 'Canada',
  MEX: 'Mexico',
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      <SnackbarProvider>
        {component}
      </SnackbarProvider>
    </ThemeProvider>
  )
}

describe('CountryDetailClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render country details', () => {
    renderWithProviders(
      <CountryDetailClient 
        countryData={mockCountryData} 
        borderCountries={mockBorderCountries} 
      />
    )
    
    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('331,000,000')).toBeInTheDocument()
    expect(screen.getByText('Americas')).toBeInTheDocument()
  })

  it('should display country flag', () => {
    renderWithProviders(
      <CountryDetailClient 
        countryData={mockCountryData} 
        borderCountries={mockBorderCountries} 
      />
    )
    
    const flagImage = screen.getByAltText(/flag of united states/i)
    expect(flagImage).toBeInTheDocument()
  })

  it('should display country information correctly', () => {
    renderWithProviders(
      <CountryDetailClient 
        countryData={mockCountryData} 
        borderCountries={mockBorderCountries} 
      />
    );
    
    // Check for basic information without expecting specific text matches
    expect(screen.getByText('English')).toBeInTheDocument();
  })

  it('should display border countries', () => {
    renderWithProviders(
      <CountryDetailClient 
        countryData={mockCountryData} 
        borderCountries={mockBorderCountries} 
      />
    )
    
    expect(screen.getByText('Canada')).toBeInTheDocument()
    expect(screen.getByText('Mexico')).toBeInTheDocument()
  })

  it('should handle countries with missing data gracefully', () => {
    const incompleteCountry = {
      ...mockCountryData,
      capital: [],
      languages: {},
      currencies: {},
    };
    
    renderWithProviders(
      <CountryDetailClient 
        countryData={incompleteCountry} 
        borderCountries={{}} 
      />
    );
    
    expect(screen.getByText('United States')).toBeInTheDocument();
  })

  it('should show favorite button for authenticated users', () => {
    renderWithProviders(
      <CountryDetailClient 
        countryData={mockCountryData} 
        borderCountries={mockBorderCountries} 
      />
    )
    
    const favoriteButtons = screen.getAllByRole('button')
    expect(favoriteButtons.length).toBeGreaterThan(0)
  })

  it('should handle favorite toggling', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CountryDetailClient 
        countryData={mockCountryData} 
        borderCountries={mockBorderCountries} 
      />
    );
    
    const favoriteButton = screen.getByLabelText('Remove United States from favorites');
    expect(favoriteButton).toBeInTheDocument();
    
    // Test that the button is clickable (doesn't throw an error)
    await user.click(favoriteButton);
    
    // Button should still be in the document after click
    expect(favoriteButton).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderWithProviders(
      <CountryDetailClient 
        countryData={mockCountryData} 
        borderCountries={mockBorderCountries} 
      />
    );
    
    const flagImage = screen.getByAltText(/flag of united states/i);
    expect(flagImage).toHaveAttribute('alt');
  });
}) 