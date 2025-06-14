import ProtectedRoute from '@/components/molecules/ProtectedRoute';

export default function Loading() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto py-8">
        {/* Back button skeleton */}
        <div className="mb-6 px-4 py-2 border border-gray-300 rounded-md w-20 h-10 bg-gray-200 animate-pulse"></div>

        <div className="bg-theme shadow-theme rounded-lg overflow-hidden">
          {/* Header with flag skeleton */}
          <div className="relative h-64 bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-lg bg-gray-200 animate-pulse"></div>
            </div>
          </div>

          <div className="p-8">
            {/* Country Name and Favorite skeleton */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Basic Information skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Border Countries skeleton */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
} 