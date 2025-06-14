import { enqueueSnackbar } from 'notistack';

/**
 * Handle API errors consistently across the application
 */
export const handleApiError = (error: unknown, defaultMessage: string = 'An error occurred') => {
    console.error('API Error:', error);

    let message = defaultMessage;

    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number }; code?: string };

        if (axiosError.response?.status === 404) {
            message = 'Resource not found';
        } else if (axiosError.response?.status === 500) {
            message = 'Server error. Please try again later.';
        } else if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
            message = 'Request failed. Please check your input.';
        } else if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
            message = 'Network error. Please check your connection.';
        }
    }

    enqueueSnackbar(message, { variant: 'error' });
};

/**
 * Show success notification
 */
export const showSuccess = (message: string) => {
    enqueueSnackbar(message, { variant: 'success' });
};

/**
 * Show info notification
 */
export const showInfo = (message: string) => {
    enqueueSnackbar(message, { variant: 'info' });
};

/**
 * Show warning notification
 */
export const showWarning = (message: string) => {
    enqueueSnackbar(message, { variant: 'warning' });
}; 