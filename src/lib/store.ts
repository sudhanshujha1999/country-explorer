import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { showSuccess, showInfo } from '@/lib/api-utils';

interface FavoriteState {
    favorites: string[];
    toggleFavorite: (cca2: string, countryName?: string) => void;
}

const useFavoriteStore = create<FavoriteState>()(
    persist(
        (set) => ({
            favorites: [],
            toggleFavorite: (cca2, countryName) =>
                set((state) => {
                    const isCurrentlyFavorite = state.favorites.includes(cca2);
                    const newFavorites = isCurrentlyFavorite
                        ? state.favorites.filter((id) => id !== cca2)
                        : [...state.favorites, cca2];

                    // Show notification
                    const action = isCurrentlyFavorite ? 'removed from' : 'added to';
                    const name = countryName || 'Country';
                    const message = `${name} ${action} favorites!`;

                    if (isCurrentlyFavorite) {
                        showInfo(message);
                    } else {
                        showSuccess(message);
                    }

                    return { favorites: newFavorites };
                }),
        }),
        { name: 'favorites-storage' } // persisted to local storage
    )
);

export default useFavoriteStore;