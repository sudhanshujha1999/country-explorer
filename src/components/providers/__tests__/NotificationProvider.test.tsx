import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { NotificationProvider } from '../NotificationProvider';

// Mock notistack
const mockEnqueueSnackbar = jest.fn();
jest.mock('notistack', () => ({
  SnackbarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="snackbar-provider">{children}</div>
  ),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueueSnackbar,
  }),
}));

// Mock component to test notification functionality
const TestComponent = () => {
  const showNotification = (message: string, variant: string = 'info') => {
    const event = new CustomEvent('show-notification', {
      detail: { message, variant },
    });
    window.dispatchEvent(event);
  };

  return (
    <div>
      <button
        onClick={() => showNotification('Test notification', 'success')}
        data-testid="show-success"
      >
        Show Success
      </button>
      <button
        onClick={() => showNotification('Error message', 'error')}
        data-testid="show-error"
      >
        Show Error
      </button>
      <button
        onClick={() => showNotification('Info message', 'info')}
        data-testid="show-info"
      >
        Show Info
      </button>
      <button
        onClick={() => showNotification('Warning message', 'warning')}
        data-testid="show-warning"
      >
        Show Warning
      </button>
      <button
        onClick={() => showNotification('Duplicate message', 'info')}
        data-testid="show-duplicate"
      >
        Show Duplicate
      </button>
    </div>
  );
};

describe('NotificationProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('component rendering', () => {
    it('should render SnackbarProvider with correct props', () => {
      render(
        <NotificationProvider>
          <div data-testid="test-child">Test Child</div>
        </NotificationProvider>
      );

      expect(screen.getByTestId('snackbar-provider')).toBeInTheDocument();
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
        <NotificationProvider>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </NotificationProvider>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      render(<NotificationProvider>{null}</NotificationProvider>);

      expect(screen.getByTestId('snackbar-provider')).toBeInTheDocument();
    });
  });

  describe('notification handling', () => {
    it('should show success notification when custom event is dispatched', async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const button = screen.getByTestId('show-success');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Test notification', {
          variant: 'success',
          autoHideDuration: 3000,
        });
      });
    });

    it('should show error notification when custom event is dispatched', async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const button = screen.getByTestId('show-error');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Error message', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      });
    });

    it('should show info notification when custom event is dispatched', async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const button = screen.getByTestId('show-info');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Info message', {
          variant: 'info',
          autoHideDuration: 3000,
        });
      });
    });

    it('should show warning notification when custom event is dispatched', async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const button = screen.getByTestId('show-warning');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Warning message', {
          variant: 'warning',
          autoHideDuration: 3000,
        });
      });
    });

    it('should handle multiple notifications', async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const successButton = screen.getByTestId('show-success');
      const errorButton = screen.getByTestId('show-error');

      fireEvent.click(successButton);
      fireEvent.click(errorButton);

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledTimes(2);
        expect(mockEnqueueSnackbar).toHaveBeenNthCalledWith(1, 'Test notification', {
          variant: 'success',
          autoHideDuration: 3000,
        });
        expect(mockEnqueueSnackbar).toHaveBeenNthCalledWith(2, 'Error message', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      });
    });
  });

  describe('duplicate notification prevention', () => {
    it('should prevent duplicate notifications within 500ms', async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const button = screen.getByTestId('show-duplicate');

      // Fire the same notification multiple times quickly
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      await waitFor(() => {
        // Should only show one notification
        expect(mockEnqueueSnackbar).toHaveBeenCalledTimes(1);
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Duplicate message', {
          variant: 'info',
          autoHideDuration: 3000,
        });
      });
    });

    it('should allow duplicate notifications after 500ms delay', async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const button = screen.getByTestId('show-duplicate');

      // First notification
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledTimes(1);
      });

      // Advance time by 500ms
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Second notification after delay
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledTimes(2);
        expect(mockEnqueueSnackbar).toHaveBeenNthCalledWith(1, 'Duplicate message', {
          variant: 'info',
          autoHideDuration: 3000,
        });
        expect(mockEnqueueSnackbar).toHaveBeenNthCalledWith(2, 'Duplicate message', {
          variant: 'info',
          autoHideDuration: 3000,
        });
      });
    });

    it('should allow different messages even if sent quickly', async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const successButton = screen.getByTestId('show-success');
      const errorButton = screen.getByTestId('show-error');

      // Fire different notifications quickly
      fireEvent.click(successButton);
      fireEvent.click(errorButton);

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledTimes(2);
        expect(mockEnqueueSnackbar).toHaveBeenNthCalledWith(1, 'Test notification', {
          variant: 'success',
          autoHideDuration: 3000,
        });
        expect(mockEnqueueSnackbar).toHaveBeenNthCalledWith(2, 'Error message', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      });
    });
  });

  describe('event listener management', () => {
    it('should add event listener on mount', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      
      render(
        <NotificationProvider>
          <div>Test</div>
        </NotificationProvider>
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'show-notification',
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
    });

    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(
        <NotificationProvider>
          <div>Test</div>
        </NotificationProvider>
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'show-notification',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });

    it('should handle events dispatched from different components', async () => {
      const TestComponent1 = () => (
        <button
          onClick={() => {
            const event = new CustomEvent('show-notification', {
              detail: { message: 'From component 1', variant: 'success' },
            });
            window.dispatchEvent(event);
          }}
          data-testid="component-1-button"
        >
          Component 1
        </button>
      );

      const TestComponent2 = () => (
        <button
          onClick={() => {
            const event = new CustomEvent('show-notification', {
              detail: { message: 'From component 2', variant: 'error' },
            });
            window.dispatchEvent(event);
          }}
          data-testid="component-2-button"
        >
          Component 2
        </button>
      );

      render(
        <NotificationProvider>
          <TestComponent1 />
          <TestComponent2 />
        </NotificationProvider>
      );

      const button1 = screen.getByTestId('component-1-button');
      const button2 = screen.getByTestId('component-2-button');

      fireEvent.click(button1);
      fireEvent.click(button2);

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledTimes(2);
        expect(mockEnqueueSnackbar).toHaveBeenNthCalledWith(1, 'From component 1', {
          variant: 'success',
          autoHideDuration: 3000,
        });
        expect(mockEnqueueSnackbar).toHaveBeenNthCalledWith(2, 'From component 2', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      });
    });
  });

  describe('edge cases', () => {
    it('should handle malformed custom events gracefully', () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );
      
      // Dispatch malformed events
      const malformedEvent1 = new CustomEvent('show-notification', { detail: null });
      const malformedEvent2 = new CustomEvent('show-notification', { detail: 'not an object' });
      const malformedEvent3 = new CustomEvent('show-notification'); // no detail
      
      act(() => {
        window.dispatchEvent(malformedEvent1);
        window.dispatchEvent(malformedEvent2);  
        window.dispatchEvent(malformedEvent3);
      });
      
      expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
    });

    it('should handle events with missing message or variant', () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );
      
      const eventWithoutMessage = new CustomEvent('show-notification', {
        detail: { variant: 'info' }
      });
      
      const eventWithoutVariant = new CustomEvent('show-notification', {
        detail: { message: 'Test message' }
      });
      
      act(() => {
        window.dispatchEvent(eventWithoutMessage);
        window.dispatchEvent(eventWithoutVariant);
      });
      
      expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
    });

    it('should handle empty message gracefully', async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );
      
      const emptyMessageEvent = new CustomEvent('show-notification', {
        detail: { message: '', variant: 'info' }
      });
      
      act(() => {
        window.dispatchEvent(emptyMessageEvent);
      });
      
      // Empty messages should be filtered out and not shown
      expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
    });

    it('should handle events with only whitespace message', async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );
      
      const whitespaceMessageEvent = new CustomEvent('show-notification', {
        detail: { message: '   ', variant: 'info' }
      });
      
      act(() => {
        window.dispatchEvent(whitespaceMessageEvent);
      });
      
      // Messages with only whitespace should be shown (the component only checks for falsy values)
      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('   ', {
          variant: 'info',
          autoHideDuration: 3000,
        });
      });
    });

    it('should handle numeric zero as message', async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );
      
      const zeroMessageEvent = new CustomEvent('show-notification', {
        detail: { message: 0, variant: 'info' }
      });
      
      act(() => {
        window.dispatchEvent(zeroMessageEvent);
      });
      
      // Numeric zero should be filtered out as it's falsy
      expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
    });
  });
}); 