import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchAndFilter from '../SearchAndFilter'

describe('SearchAndFilter', () => {
  const mockOnSearchChange = jest.fn()
  const mockOnRegionChange = jest.fn()

  const defaultProps = {
    searchTerm: '',
    selectedRegion: '',
    onSearchChange: mockOnSearchChange,
    onRegionChange: mockOnRegionChange,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render search input and region filter', () => {
    render(<SearchAndFilter {...defaultProps} />)
    
    expect(screen.getByPlaceholderText('Search for a country...')).toBeInTheDocument()
    expect(screen.getByDisplayValue('All Regions')).toBeInTheDocument()
  })

  it('should display current search term', () => {
    render(<SearchAndFilter {...defaultProps} searchTerm="United States" />)
    
    const searchInput = screen.getByDisplayValue('United States')
    expect(searchInput).toBeInTheDocument()
  })

  it('should display current selected region', () => {
    render(<SearchAndFilter {...defaultProps} selectedRegion="Europe" />)
    
    const regionSelect = screen.getByDisplayValue('Europe')
    expect(regionSelect).toBeInTheDocument()
  })

  it('should call onSearchChange when typing in search input', async () => {
    const user = userEvent.setup()
    render(<SearchAndFilter {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search for a country...')
    await user.type(searchInput, 'Canada')
    
    // Check that onSearchChange was called with the final character
    expect(mockOnSearchChange).toHaveBeenCalledWith('a')
    expect(mockOnSearchChange).toHaveBeenCalledTimes(6) // C-a-n-a-d-a
  })

  it('should call onRegionChange when selecting a region', async () => {
    const user = userEvent.setup()
    render(<SearchAndFilter {...defaultProps} />)
    
    const regionSelect = screen.getByRole('combobox')
    await user.selectOptions(regionSelect, 'Europe')
    
    expect(mockOnRegionChange).toHaveBeenCalledWith('Europe')
  })

  it('should render all region options', () => {
    render(<SearchAndFilter {...defaultProps} />)
    
    const options = screen.getAllByRole('option')
    
    expect(options).toHaveLength(6) // All Regions + 5 regions
    expect(screen.getByText('All Regions')).toBeInTheDocument()
    expect(screen.getByText('Africa')).toBeInTheDocument()
    expect(screen.getByText('Americas')).toBeInTheDocument()
    expect(screen.getByText('Asia')).toBeInTheDocument()
    expect(screen.getByText('Europe')).toBeInTheDocument()
    expect(screen.getByText('Oceania')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<SearchAndFilter {...defaultProps} />)
    
    const searchInput = screen.getByRole('textbox')
    expect(searchInput).toHaveAttribute('aria-describedby', 'search-description')
    expect(searchInput).toHaveAttribute('id', 'country-search')
    
    const regionSelect = screen.getByRole('combobox')
    expect(regionSelect).toHaveAttribute('aria-describedby', 'filter-description')
    expect(regionSelect).toHaveAttribute('id', 'region-filter')
  })

  it('should clear search when input is emptied', async () => {
    const user = userEvent.setup()
    render(<SearchAndFilter {...defaultProps} searchTerm="Canada" />)
    
    const searchInput = screen.getByDisplayValue('Canada')
    await user.clear(searchInput)
    
    expect(mockOnSearchChange).toHaveBeenCalledWith('')
  })

  it('should reset to all regions when selecting "All Regions"', async () => {
    const user = userEvent.setup()
    render(<SearchAndFilter {...defaultProps} selectedRegion="Europe" />)
    
    const regionSelect = screen.getByRole('combobox')
    await user.selectOptions(regionSelect, '')
    
    expect(mockOnRegionChange).toHaveBeenCalledWith('')
  })

  it('should have responsive layout classes', () => {
    render(<SearchAndFilter {...defaultProps} />)
    
    const container = screen.getByRole('textbox').closest('div')?.parentElement
    expect(container).toHaveClass('flex', 'flex-col', 'sm:flex-row')
  })

  it('should handle rapid typing without issues', async () => {
    const user = userEvent.setup()
    render(<SearchAndFilter {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search for a country...')
    
    // Type rapidly
    await user.type(searchInput, 'United States of America')
    
    // Should have called onSearchChange for each character
    expect(mockOnSearchChange).toHaveBeenCalledTimes(24) // Length of "United States of America"
    expect(mockOnSearchChange).toHaveBeenNthCalledWith(24, 'a') // Last character
  })

  it('should maintain focus on search input after typing', async () => {
    const user = userEvent.setup()
    render(<SearchAndFilter {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search for a country...')
    await user.click(searchInput)
    await user.type(searchInput, 'France')
    
    expect(searchInput).toHaveFocus()
  })

  it('should have proper styling classes for mobile responsiveness', () => {
    render(<SearchAndFilter {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search for a country...')
    expect(searchInput.parentElement).toHaveClass('flex-1')
    
    const regionSelect = screen.getByRole('combobox')
    expect(regionSelect.parentElement).toHaveClass('sm:w-64')
    expect(regionSelect).toHaveClass('w-full')
  })
}) 