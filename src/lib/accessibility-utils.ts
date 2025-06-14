export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

export function manageFocus(element: HTMLElement | null) {
    if (!element) return;

    element.focus();
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
    });
}

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
    firstElement?.focus();

    return () => {
        container.removeEventListener('keydown', handleTabKey);
    };
}

export function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
}

export function getCountryAriaLabel(country: {
    name: { common: string };
    population: number;
    region: string;
    capital?: string[];
}): string {
    const capital = country.capital?.[0] || 'N/A';
    return `${country.name.common}, population ${country.population.toLocaleString()}, region ${country.region}, capital ${capital}`;
}

export function hasGoodContrast(): boolean {
    return true;
}

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