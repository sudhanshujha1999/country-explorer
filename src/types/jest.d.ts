import '@testing-library/jest-dom'

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R
            toHaveAttribute(attr: string, value?: string): R
            toHaveClass(...classNames: string[]): R
            toHaveFocus(): R
            toHaveValue(value: string | number): R
            toBeVisible(): R
            toBeDisabled(): R
            toBeEnabled(): R
            toBeChecked(): R
            toHaveTextContent(text: string | RegExp): R
        }
    }
} 