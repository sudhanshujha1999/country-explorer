import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteState {
    favorites: string[];
    toggleFavorite: (cca2: string) => void;
}

const useFavoriteStore = create<FavoriteState>()(
    persist(
        (set) => ({
            favorites: [],
            toggleFavorite: (cca2) =>
                set((state) => ({
                    favorites: state.favorites.includes(cca2)
                        ? state.favorites.filter((id) => id !== cca2)
                        : [...state.favorites, cca2],
                })),
        }),
        { name: 'favorites-storage' } // persisted to local storage
    )
);

export default useFavoriteStore;