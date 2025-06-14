import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'next-themes'
import Header from '../Header'
import { useRouter } from 'next/navigation'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock the stores
const mockLogout = jest.fn()
jest.mock('../../../lib/auth-store', () => ({
  __esModule: true,
  default: () => ({
    user: { username: 'testuser', email: 'test@example.com' },
    isAuthenticated: true,
    logout: mockLogout,
  }),
}))

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      {component}
    </ThemeProvider>
  )
}

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup router mock
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    })
  })

  it('should render header with navigation links', () => {
    renderWithProviders(<Header />)
    
    expect(screen.getByText('GlobeTrekker')).toBeInTheDocument()
    expect(screen.getByText('Explore')).toBeInTheDocument()
    expect(screen.getByText('Favorites')).toBeInTheDocument()
  })

  it('should handle logout functionality', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Header />)
    
    const logoutButton = screen.getByText('Sign out')
    await user.click(logoutButton)
    
    expect(mockLogout).toHaveBeenCalled()
  })

  it('should have proper accessibility attributes', () => {
    renderWithProviders(<Header />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('should display theme toggle button', () => {
    renderWithProviders(<Header />)
    
    // Should show theme toggle button
    const themeButton = screen.getByLabelText('Switch to dark mode')
    expect(themeButton).toBeInTheDocument()
  })

  it('should show mobile menu button', () => {
    renderWithProviders(<Header />)
    
    const menuButton = screen.getByLabelText('Open menu')
    expect(menuButton).toBeInTheDocument()
  })

  it('should have proper ARIA labels for accessibility', () => {
    renderWithProviders(<Header />)
    
    const banner = screen.getByRole('banner')
    expect(banner).toBeInTheDocument()
    
    const navigation = screen.getByRole('navigation')
    expect(navigation).toHaveAttribute('aria-label', 'Main navigation')
  })
}) 