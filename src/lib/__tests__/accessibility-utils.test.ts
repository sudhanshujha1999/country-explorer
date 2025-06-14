import {
    announceToScreenReader,
    manageFocus,
    trapFocus,
    prefersReducedMotion,
    prefersHighContrast,
    getCountryAriaLabel,
    hasGoodContrast,
    handleArrowNavigation,
} from '../accessibility-utils';

// Mock DOM methods
const mockScrollIntoView = jest.fn();
const mockFocus = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock DOM methods
    Element.prototype.scrollIntoView = mockScrollIntoView;
    HTMLElement.prototype.focus = mockFocus;
    HTMLElement.prototype.addEventListener = mockAddEventListener;
    HTMLElement.prototype.removeEventListener = mockRemoveEventListener;

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });

    // Clear document body
    document.body.innerHTML = '';
});

afterEach(() => {
    // Clean up any remaining elements
    document.body.innerHTML = '';
    jest.clearAllTimers();
});

describe('announceToScreenReader', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('should create an announcement element with proper attributes', () => {
        const message = 'Test announcement';
        announceToScreenReader(message);

        const announcementElement = document.querySelector('[aria-live]');
        expect(announcementElement).toBeTruthy();
        expect(announcementElement?.getAttribute('aria-live')).toBe('polite');
        expect(announcementElement?.getAttribute('aria-atomic')).toBe('true');
        expect(announcementElement?.textContent).toBe(message);
        expect(announcementElement?.className).toBe('sr-only');
    });

    it('should create assertive announcement when priority is set', () => {
        const message = 'Urgent announcement';
        announceToScreenReader(message, 'assertive');

        const announcementElement = document.querySelector('[aria-live]');
        expect(announcementElement?.getAttribute('aria-live')).toBe('assertive');
    });

    it('should remove announcement element after timeout', () => {
        const message = 'Temporary announcement';
        announceToScreenReader(message);

        expect(document.querySelector('[aria-live]')).toBeTruthy();

        // Fast-forward time by 1000ms
        jest.advanceTimersByTime(1000);

        expect(document.querySelector('[aria-live]')).toBeNull();
    });
});

describe('manageFocus', () => {
    it('should focus element and scroll into view', () => {
        const element = document.createElement('button');
        manageFocus(element);

        expect(mockFocus).toHaveBeenCalled();
        expect(mockScrollIntoView).toHaveBeenCalledWith({
            behavior: 'smooth',
            block: 'center',
        });
    });

    it('should handle null element gracefully', () => {
        manageFocus(null);
        expect(mockFocus).not.toHaveBeenCalled();
        expect(mockScrollIntoView).not.toHaveBeenCalled();
    });
});

describe('trapFocus', () => {
    let container: HTMLElement;
    let firstButton: HTMLElement;
    let secondButton: HTMLElement;
    let lastButton: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        firstButton = document.createElement('button');
        secondButton = document.createElement('button');
        lastButton = document.createElement('button');

        container.appendChild(firstButton);
        container.appendChild(secondButton);
        container.appendChild(lastButton);

        document.body.appendChild(container);
    });

    it('should set up event listener and focus first element', () => {
        const cleanup = trapFocus(container);

        expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(mockFocus).toHaveBeenCalled();
        expect(typeof cleanup).toBe('function');
    });

    it('should handle Tab key navigation', () => {
        trapFocus(container);
        const eventHandler = mockAddEventListener.mock.calls[0][1];

        // Mock document.activeElement
        Object.defineProperty(document, 'activeElement', {
            value: lastButton,
            writable: true,
        });

        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
        const preventDefault = jest.spyOn(tabEvent, 'preventDefault');

        eventHandler(tabEvent);

        expect(preventDefault).toHaveBeenCalled();
    });

    it('should handle Shift+Tab key navigation', () => {
        trapFocus(container);
        const eventHandler = mockAddEventListener.mock.calls[0][1];

        Object.defineProperty(document, 'activeElement', {
            value: firstButton,
            writable: true,
        });

        const shiftTabEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true
        });
        const preventDefault = jest.spyOn(shiftTabEvent, 'preventDefault');

        eventHandler(shiftTabEvent);

        expect(preventDefault).toHaveBeenCalled();
    });

    it('should remove event listener on cleanup', () => {
        const cleanup = trapFocus(container);
        cleanup();

        expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
});

describe('prefersReducedMotion', () => {
    it('should return true when user prefers reduced motion', () => {
        (window.matchMedia as jest.Mock).mockReturnValue({
            matches: true,
        });

        expect(prefersReducedMotion()).toBe(true);
        expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('should return false when user does not prefer reduced motion', () => {
        (window.matchMedia as jest.Mock).mockReturnValue({
            matches: false,
        });

        expect(prefersReducedMotion()).toBe(false);
    });
});

describe('prefersHighContrast', () => {
    it('should return true when user prefers high contrast', () => {
        (window.matchMedia as jest.Mock).mockReturnValue({
            matches: true,
        });

        expect(prefersHighContrast()).toBe(true);
        expect(window.matchMedia).toHaveBeenCalledWith('(prefers-contrast: high)');
    });

    it('should return false when user does not prefer high contrast', () => {
        (window.matchMedia as jest.Mock).mockReturnValue({
            matches: false,
        });

        expect(prefersHighContrast()).toBe(false);
    });
});

describe('getCountryAriaLabel', () => {
    it('should generate proper aria label for country with capital', () => {
        const country = {
            name: { common: 'United States' },
            population: 331000000,
            region: 'Americas',
            capital: ['Washington, D.C.'],
        };

        const label = getCountryAriaLabel(country);
        expect(label).toBe('United States, population 331,000,000, region Americas, capital Washington, D.C.');
    });

    it('should handle country without capital', () => {
        const country = {
            name: { common: 'Vatican City' },
            population: 800,
            region: 'Europe',
        };

        const label = getCountryAriaLabel(country);
        expect(label).toBe('Vatican City, population 800, region Europe, capital N/A');
    });

    it('should handle country with empty capital array', () => {
        const country = {
            name: { common: 'Antarctica' },
            population: 0,
            region: 'Antarctic',
            capital: [],
        };

        const label = getCountryAriaLabel(country);
        expect(label).toBe('Antarctica, population 0, region Antarctic, capital N/A');
    });
});

describe('hasGoodContrast', () => {
    it('should return true (simplified implementation)', () => {
        expect(hasGoodContrast('#ffffff', '#000000')).toBe(true);
        expect(hasGoodContrast('#ff0000', '#00ff00')).toBe(true);
    });
});

describe('handleArrowNavigation', () => {
    let items: HTMLElement[];
    let onNavigate: jest.Mock;

    beforeEach(() => {
        items = [
            document.createElement('button'),
            document.createElement('button'),
            document.createElement('button'),
        ];
        onNavigate = jest.fn();
    });

    it('should handle ArrowDown navigation', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        const preventDefault = jest.spyOn(event, 'preventDefault');

        handleArrowNavigation(event, items, 0, onNavigate);

        expect(preventDefault).toHaveBeenCalled();
        expect(onNavigate).toHaveBeenCalledWith(1);
        expect(mockFocus).toHaveBeenCalled();
    });

    it('should handle ArrowUp navigation', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        const preventDefault = jest.spyOn(event, 'preventDefault');

        handleArrowNavigation(event, items, 1, onNavigate);

        expect(preventDefault).toHaveBeenCalled();
        expect(onNavigate).toHaveBeenCalledWith(0);
    });

    it('should wrap around on ArrowDown from last item', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

        handleArrowNavigation(event, items, 2, onNavigate);

        expect(onNavigate).toHaveBeenCalledWith(0);
    });

    it('should wrap around on ArrowUp from first item', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

        handleArrowNavigation(event, items, 0, onNavigate);

        expect(onNavigate).toHaveBeenCalledWith(2);
    });

    it('should handle Home key', () => {
        const event = new KeyboardEvent('keydown', { key: 'Home' });

        handleArrowNavigation(event, items, 2, onNavigate);

        expect(onNavigate).toHaveBeenCalledWith(0);
    });

    it('should handle End key', () => {
        const event = new KeyboardEvent('keydown', { key: 'End' });

        handleArrowNavigation(event, items, 0, onNavigate);

        expect(onNavigate).toHaveBeenCalledWith(2);
    });

    it('should handle ArrowRight and ArrowLeft', () => {
        const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });

        handleArrowNavigation(rightEvent, items, 0, onNavigate);
        expect(onNavigate).toHaveBeenCalledWith(1);

        onNavigate.mockClear();

        handleArrowNavigation(leftEvent, items, 1, onNavigate);
        expect(onNavigate).toHaveBeenCalledWith(0);
    });

    it('should ignore other keys', () => {
        const event = new KeyboardEvent('keydown', { key: 'Space' });
        const preventDefault = jest.spyOn(event, 'preventDefault');

        handleArrowNavigation(event, items, 0, onNavigate);

        expect(preventDefault).not.toHaveBeenCalled();
        expect(onNavigate).not.toHaveBeenCalled();
    });
}); 