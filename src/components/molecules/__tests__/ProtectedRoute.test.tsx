import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../ProtectedRoute';
import useAuthStore from '../../../lib/auth-store';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock auth store
jest.mock('../../../lib/auth-store', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default router mock
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it('should render children when user is authenticated', () => {
    // Mock authenticated user
    mockUseAuthStore.mockReturnValue({
      user: { username: 'testuser', email: 'test@example.com' },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', async () => {
    // Mock unauthenticated user
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should not render content during redirect', () => {
    // Mock unauthenticated user
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    // Content should not be visible
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should handle auth state changes', async () => {
    let authState: {
      user: { username: string; email: string } | null;
      isAuthenticated: boolean;
      login: jest.Mock;
      logout: jest.Mock;
    } = {
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    };

    mockUseAuthStore.mockImplementation(() => authState);

    const { rerender } = render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    // Initially should redirect
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

    // Update auth state to authenticated
    authState = {
      user: { username: 'testuser', email: 'test@example.com' },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
    };

    rerender(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    // Now should render content
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should handle empty children gracefully', () => {
    mockUseAuthStore.mockReturnValue({
      user: { username: 'testuser', email: 'test@example.com' },
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<ProtectedRoute>{null}</ProtectedRoute>);

    // Should not crash with null children
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should display redirect message with correct styling', () => {
    // Mock unauthenticated user
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    const message = screen.getByText('Redirecting to login...');
    expect(message).toBeInTheDocument();
    
    const container = message.closest('.text-center');
    expect(container).toHaveClass('text-center', 'py-12');
  });
}); 