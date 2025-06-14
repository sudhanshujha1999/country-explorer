import { renderHook, act } from '@testing-library/react'
import useAuthStore from '../auth-store'

// Mock window.dispatchEvent
const mockDispatchEvent = jest.fn()
Object.defineProperty(window, 'dispatchEvent', {
    value: mockDispatchEvent,
})

describe('useAuthStore', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        // Reset store state
        useAuthStore.setState({ user: null, isAuthenticated: false })
    })

    it('should initialize with no user and not authenticated', () => {
        const { result } = renderHook(() => useAuthStore())

        expect(result.current.user).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
    })

    it('should login successfully with correct credentials', async () => {
        const { result } = renderHook(() => useAuthStore())

        let loginResult
        await act(async () => {
            loginResult = await result.current.login('testuser', 'password123')
        })

        expect(loginResult).toEqual({ success: true })
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.user).toEqual({
            username: 'testuser',
            email: 'testuser@example.com'
        })
    })

    it('should fail login with incorrect credentials', async () => {
        const { result } = renderHook(() => useAuthStore())

        let loginResult
        await act(async () => {
            loginResult = await result.current.login('wronguser', 'wrongpass')
        })

        expect(loginResult).toEqual({
            success: false,
            error: 'Invalid username or password'
        })
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.user).toBeNull()
    })

    it('should dispatch success notification on successful login', async () => {
        const { result } = renderHook(() => useAuthStore())

        await act(async () => {
            await result.current.login('testuser', 'password123')
        })

        expect(mockDispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'show-notification',
                detail: {
                    message: 'Successfully logged in!',
                    variant: 'success'
                }
            })
        )
    })

    it('should logout and clear user data', () => {
        const { result } = renderHook(() => useAuthStore())

        // First login
        act(() => {
            useAuthStore.setState({
                user: { username: 'testuser', email: 'testuser@example.com' },
                isAuthenticated: true
            })
        })

        // Then logout
        act(() => {
            result.current.logout()
        })

        expect(result.current.user).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
    })

    it('should dispatch logout notification on logout', () => {
        const { result } = renderHook(() => useAuthStore())

        // Set initial logged in state
        act(() => {
            useAuthStore.setState({
                user: { username: 'testuser', email: 'testuser@example.com' },
                isAuthenticated: true
            })
        })

        // Clear previous calls
        mockDispatchEvent.mockClear()

        act(() => {
            result.current.logout()
        })

        expect(mockDispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'show-notification',
                detail: {
                    message: 'Goodbye testuser! You have been logged out.',
                    variant: 'info'
                }
            })
        )
    })

    it('should handle logout with no user gracefully', () => {
        const { result } = renderHook(() => useAuthStore())

        act(() => {
            result.current.logout()
        })

        expect(mockDispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    message: 'Goodbye User! You have been logged out.',
                    variant: 'info'
                }
            })
        )
    })

    it('should simulate API delay during login', async () => {
        const { result } = renderHook(() => useAuthStore())

        const startTime = Date.now()
        await act(async () => {
            await result.current.login('testuser', 'password123')
        })
        const endTime = Date.now()

        // Should take at least 500ms due to simulated delay
        expect(endTime - startTime).toBeGreaterThanOrEqual(500)
    })
}) 