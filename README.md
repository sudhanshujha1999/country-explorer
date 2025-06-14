# 🌍 Country Explorer

A modern, responsive web application built with Next.js that allows users to explore countries around the world, view detailed information, and manage their favorite countries.

## 🚀 Live Demo

[View Live Application](https://country-explorer-three-tau.vercel.app/)
## 📋 Features

### Core Features
- **Country Listing**: Browse all countries with essential information (flag, name, population, region, capital)
- **Country Details**: View comprehensive information about any country including native names, currencies, languages, and border countries
- **Search & Filter**: Client-side search by country name and filter by region
- **User Authentication**: Mock authentication system with login/logout functionality
- **Favorites Management**: Add/remove countries to/from favorites with persistent storage
- **Protected Routes**: Secure access to detailed views and favorites page

### Bonus Features ✨
- **Theme Switcher**: Light/dark mode toggle
- **Skeleton Loading**: Advanced loading states for better UX
- **Accessibility**: WCAG compliant with screen reader support, keyboard navigation, and ARIA labels
- **Comprehensive Testing**: 136 tests covering all major components and functionality
- **Image Optimization**: Using Next.js `next/image` for optimized flag images
- **Form Validation**: Robust validation for login form
- **Responsive Design**: Mobile-first approach with seamless desktop experience

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Hooks
- **Authentication**: Mock system with persistent storage
- **Testing**: Jest + React Testing Library
- **Image Optimization**: Next.js Image component
- **Theme Management**: next-themes
- **Notifications**: notistack
- **Icons**: Heroicons

## 🚀 Setup and Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd country-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🔐 Authentication Credentials

The application uses a mock authentication system. Use these credentials to log in:

- **Username**: `testuser`
- **Password**: `password123`

## 🏗️ Architecture & Design Choices

### Rendering Strategy

#### SSG (Static Site Generation)
- **Homepage (/)**: Uses SSG with ISR (Incremental Static Regeneration) revalidating every hour
- **Rationale**: Country data changes infrequently, making SSG ideal for performance while ISR ensures data freshness

#### SSG with Dynamic Paths
- **Country Detail Pages (/country/[id])**: Uses SSG with `generateStaticParams` returning empty array for on-demand generation
- **Rationale**: Generates pages dynamically when visited, then caches them. Balances performance with practicality (195+ countries)

#### CSR (Client-Side Rendering)
- **Protected Pages**: `/favorites` and `/login` use CSR for dynamic, user-specific content
- **Rationale**: These pages require authentication state and user-specific data

### State Management Solutions

#### 1. **Zustand for Authentication**
```typescript
// Global auth state with persistence
const useAuthStore = create()(persist(...))
```
- **Why**: Lightweight, TypeScript-friendly, built-in persistence
- **Usage**: Login/logout state, user information

#### 2. **React Hooks for Favorites**
```typescript
// Custom hook with localStorage persistence
const useFavoriteStore = (): FavoritesHook => { ... }
```
- **Why**: Simple state management for favorites with localStorage integration
- **Usage**: Add/remove favorites, persist across sessions

#### 3. **Zustand for Countries Cache**
```typescript
// Cache for country data to avoid redundant API calls
const useCountriesStore = create()(persist(...))
```
- **Why**: Reduces API calls, improves performance
- **Usage**: Cache country list data client-side

### Caching Strategy

#### 1. **Next.js Built-in Caching**
- **Static Generation**: Homepage cached at build time
- **ISR**: Revalidates every hour for fresh data
- **Dynamic Routes**: On-demand generation with permanent caching

#### 2. **Client-Side Caching**
- **Countries Store**: Caches full country list to avoid repeated API calls
- **localStorage**: Persists favorites and auth state across sessions

#### 3. **API Optimization**
- **Field Selection**: Uses `fields` parameter to fetch only necessary data
- **Efficient Endpoints**: Different endpoints for list vs. detail views

### Component Architecture

#### Atomic Design Pattern
```
src/components/
├── atom/           # Basic building blocks (Header)
├── molecules/      # Simple combinations (SearchAndFilter, ProtectedRoute)
├── organism/       # Complex components (CountryList, CountryListClient)
└── providers/      # Context providers (NotificationProvider)
```

#### Key Design Decisions

1. **Separation of Concerns**
   - Server components for data fetching
   - Client components for interactivity
   - Custom hooks for state logic

2. **Accessibility First**
   - ARIA labels and roles throughout
   - Keyboard navigation support
   - Screen reader announcements
   - Focus management

3. **Performance Optimization**
   - Image optimization with `next/image`
   - Lazy loading and code splitting
   - Efficient re-renders with proper memoization

4. **Error Handling**
   - Graceful API error handling
   - User-friendly error messages
   - Fallback UI states

## 🧪 Testing

The application includes comprehensive testing coverage:

- **11 test suites** with **136 passing tests**
- **Unit tests** for utilities and stores
- **Integration tests** for components
- **Accessibility testing** for a11y compliance

Run tests:
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm test -- --coverage    # With coverage report
```

## 📱 Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Adaptive layouts**: Different layouts for mobile vs desktop
- **Touch-friendly**: Appropriate touch targets and interactions

## ♿ Accessibility Features

- **WCAG 2.1 AA compliant**
- **Screen reader support** with proper ARIA labels
- **Keyboard navigation** for all interactive elements
- **Focus management** and visual indicators
- **Color contrast** meeting accessibility standards
- **Semantic HTML** structure

## 🚀 Deployment

The application is optimized for deployment on Vercel or Netlify:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel
   ```

3. **Environment Variables** (if needed)
   - No external APIs requiring keys
   - All configuration is build-time

## 🔮 Future Enhancements

- **Real Authentication**: Integration with Auth0 or similar
- **Database Integration**: Store favorites server-side
- **Advanced Filtering**: More filter options (population, area, etc.)
- **Country Comparison**: Side-by-side country comparison
- **Maps Integration**: Interactive world map
- **PWA Features**: Offline support and app installation

