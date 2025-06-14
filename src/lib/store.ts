import { useState, useEffect, useRef } from 'react';

const FAVORITES_STORAGE_KEY = 'favorites-storage';

interface FavoritesHook {
    favorites: string[];
    toggleFavorite: (cca2: string, countryName?: string) => void;
}

const useFavoriteStore = (): FavoritesHook => {
    const [favorites, setFavorites] = useState<string[]>([]);
    const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
            if (stored) {
                const parsedData = JSON.parse(stored);
                // Handle both old Zustand format and new format
                const favoritesArray = parsedData.state?.favorites || parsedData.favorites || parsedData;
                if (Array.isArray(favoritesArray)) {
                    setFavorites(favoritesArray);
                }
            }
        } catch (error) {
            console.error('Error loading favorites from localStorage:', error);
            setFavorites([]);
        }
    }, []);

    // Save favorites to localStorage whenever favorites change
    useEffect(() => {
        try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({ favorites }));
        } catch (error) {
            console.error('Error saving favorites to localStorage:', error);
        }
    }, [favorites]);

    const toggleFavorite = (cca2: string, countryName?: string) => {
        setFavorites(prevFavorites => {
            const isCurrentlyFavorite = prevFavorites.includes(cca2);
            const newFavorites = isCurrentlyFavorite
                ? prevFavorites.filter((id) => id !== cca2)
                : [...prevFavorites, cca2];

            // Clear any existing notification timeout
            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }

            // Debounce notification to prevent duplicates
            notificationTimeoutRef.current = setTimeout(() => {
                if (typeof window !== 'undefined') {
                    const action = isCurrentlyFavorite ? 'removed from' : 'added to';
                    const name = countryName || 'Country';
                    const message = `${name} ${action} favorites!`;

                    const event = new CustomEvent('show-notification', {
                        detail: {
                            message,
                            variant: isCurrentlyFavorite ? 'info' : 'success'
                        }
                    });
                    window.dispatchEvent(event);
                }
            }, 100); // 100ms debounce

            return newFavorites;
        });
    };

    return {
        favorites,
        toggleFavorite,
    };
};

export default useFavoriteStore;