import { renderHook, act } from '@testing-library/react'
import useFavoriteStore from '../store'

// Mock localStorage
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
})

// Mock window.dispatchEvent
const mockDispatchEvent = jest.fn()
Object.defineProperty(window, 'dispatchEvent', {
    value: mockDispatchEvent,
})

describe('useFavoriteStore', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockLocalStorage.getItem.mockReturnValue(null)
    })

    it('should initialize with empty favorites', () => {
        const { result } = renderHook(() => useFavoriteStore())

        expect(result.current.favorites).toEqual([])
    })

    it('should load favorites from localStorage on initialization', () => {
        const storedFavorites = JSON.stringify({ favorites: ['US', 'CA'] })
        mockLocalStorage.getItem.mockReturnValue(storedFavorites)

        const { result } = renderHook(() => useFavoriteStore())

        expect(result.current.favorites).toEqual(['US', 'CA'])
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('favorites-storage')
    })

    it('should handle old Zustand format from localStorage', () => {
        const oldFormat = JSON.stringify({ state: { favorites: ['US', 'CA'] } })
        mockLocalStorage.getItem.mockReturnValue(oldFormat)

        const { result } = renderHook(() => useFavoriteStore())

        expect(result.current.favorites).toEqual(['US', 'CA'])
    })

    it('should handle invalid localStorage data gracefully', () => {
        mockLocalStorage.getItem.mockReturnValue('invalid json')
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

        const { result } = renderHook(() => useFavoriteStore())

        expect(result.current.favorites).toEqual([])
        expect(consoleSpy).toHaveBeenCalled()

        consoleSpy.mockRestore()
    })

    it('should add a country to favorites', () => {
        const { result } = renderHook(() => useFavoriteStore())

        act(() => {
            result.current.toggleFavorite('US', 'United States')
        })

        expect(result.current.favorites).toContain('US')
    })

    it('should remove a country from favorites', () => {
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ favorites: ['US'] }))
        const { result } = renderHook(() => useFavoriteStore())

        act(() => {
            result.current.toggleFavorite('US', 'United States')
        })

        expect(result.current.favorites).not.toContain('US')
    })

    it('should save favorites to localStorage when updated', () => {
        const { result } = renderHook(() => useFavoriteStore())

        act(() => {
            result.current.toggleFavorite('US', 'United States')
        })

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
            'favorites-storage',
            JSON.stringify({ favorites: ['US'] })
        )
    })

    it('should dispatch notification event when adding favorite', (done) => {
        const { result } = renderHook(() => useFavoriteStore())

        act(() => {
            result.current.toggleFavorite('US', 'United States')
        })

        // Use setTimeout to wait for the debounced notification
        setTimeout(() => {
            expect(mockDispatchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'show-notification',
                    detail: {
                        message: 'United States added to favorites!',
                        variant: 'success'
                    }
                })
            )
            done()
        }, 150)
    })

    it('should dispatch notification event when removing favorite', (done) => {
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ favorites: ['US'] }))
        const { result } = renderHook(() => useFavoriteStore())

        act(() => {
            result.current.toggleFavorite('US', 'United States')
        })

        // Use setTimeout to wait for the debounced notification
        setTimeout(() => {
            expect(mockDispatchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'show-notification',
                    detail: {
                        message: 'United States removed from favorites!',
                        variant: 'info'
                    }
                })
            )
            done()
        }, 150)
    })

    it('should use default country name if not provided', (done) => {
        const { result } = renderHook(() => useFavoriteStore())

        act(() => {
            result.current.toggleFavorite('US')
        })

        setTimeout(() => {
            expect(mockDispatchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: {
                        message: 'Country added to favorites!',
                        variant: 'success'
                    }
                })
            )
            done()
        }, 150)
    })
}) 