import ProtectedRoute from '@/components/molecules/ProtectedRoute';

export default function Loading() {
  return (
    <ProtectedRoute>
      <main className="relative">
        <div className="absolute top-4 left-4 z-10 w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>

        <div className="container mx-auto px-0 md:px-4 md:py-16">
          <article className="bg-white dark:bg-gray-800 shadow-lg sm:rounded-lg overflow-hidden relative">
            <div className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>

            <div className="flex flex-col md:flex-row md:min-h-[600px]">
              <div className="md:w-2/5 h-48 md:h-auto bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center p-4 md:p-8 animate-pulse">
                <div className="w-24 h-24 md:w-80 md:h-60 rounded-lg bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
              </div>

              <div className="md:w-3/5 p-4 md:p-8">
                <div className="mb-6 md:mb-8">
                  <div className="h-8 md:h-12 bg-gray-200 dark:bg-gray-700 rounded w-48 md:w-64 mb-4 md:mb-6 animate-pulse"></div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
                  <div className="flex flex-wrap gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
    </ProtectedRoute>
  );
} 