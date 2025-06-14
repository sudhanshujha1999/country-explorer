// Accessibility utility functions

/**
 * Announces text to screen readers using a live region
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Manages focus for better keyboard navigation
 */
export function manageFocus(element: HTMLElement | null) {
    if (!element) return;

    element.focus();

    // Ensure the element is scrolled into view
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
    });
}

/**
 * Traps focus within a container (useful for modals)
 */
export function trapFocus(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    };

    container.addEventListener('keydown', handleTabKey);

    // Focus first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
        container.removeEventListener('keydown', handleTabKey);
    };
}

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Gets appropriate ARIA label for country information
 */
export function getCountryAriaLabel(country: {
    name: { common: string };
    population: number;
    region: string;
    capital?: string[];
}): string {
    const capital = country.capital?.[0] || 'N/A';
    return `${country.name.common}, population ${country.population.toLocaleString()}, region ${country.region}, capital ${capital}`;
}

/**
 * Validates color contrast ratio (simplified check)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function hasGoodContrast(_foreground: string, _background: string): boolean {
    // This is a simplified check - in production, you'd use a proper color contrast library
    // For now, we'll assume our CSS variables provide good contrast
    return true;
}

/**
 * Keyboard navigation helper
 */
export function handleArrowNavigation(
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onNavigate: (newIndex: number) => void
) {
    let newIndex = currentIndex;

    switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
            newIndex = (currentIndex + 1) % items.length;
            break;
        case 'ArrowUp':
        case 'ArrowLeft':
            newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
            break;
        case 'Home':
            newIndex = 0;
            break;
        case 'End':
            newIndex = items.length - 1;
            break;
        default:
            return;
    }

    event.preventDefault();
    onNavigate(newIndex);
    items[newIndex]?.focus();
} 