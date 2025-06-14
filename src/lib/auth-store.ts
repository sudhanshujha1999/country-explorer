import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { showSuccess, showInfo } from '@/lib/api-utils';

interface User {
    username: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

// Mock credentials
const MOCK_CREDENTIALS = {
    username: 'testuser',
    password: 'password123'
};

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,

            login: async (username: string, password: string) => {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 500));

                if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
                    const user = { username, email: 'testuser@example.com' };
                    set({ user, isAuthenticated: true });
                    showSuccess('Successfully logged in!');
                    return { success: true };
                } else {
                    return { success: false, error: 'Invalid username or password' };
                }
            },

            logout: () => {
                const currentUser = get().user;
                set({ user: null, isAuthenticated: false });
                showInfo(`Goodbye ${currentUser?.username || 'User'}! You have been logged out.`);
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);

export default useAuthStore; 