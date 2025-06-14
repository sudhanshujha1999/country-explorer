export default function Loading() {
  return (
    <main className="container mx-auto py-6 sm:py-8" id="main-content">
      <div className="mb-6 sm:mb-8 px-4 sm:px-0">
        <div className="h-8 sm:h-9 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 px-4 sm:px-0 animate-pulse"></div>
        <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-80 px-4 sm:px-0 animate-pulse"></div>
      </div>

      {/* Search and Filter skeleton */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 px-4 sm:px-0">
        <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        <div className="w-full sm:w-64 h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>

      {/* Country List skeleton */}
      <div className="px-4 sm:px-0">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {/* Header skeleton - only show on desktop */}
          <div className="hidden sm:grid grid-cols-6 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            {['Flag', 'Name', 'Population', 'Region', 'Capital', 'Favorite'].map((_, i) => (
              <div key={i} className={`h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse ${i >= 3 ? 'hidden md:block' : ''} ${i >= 4 ? 'hidden lg:block' : ''}`}></div>
            ))}
          </div>

          {/* Country rows skeleton */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-4">
                {/* Mobile layout skeleton */}
                <div className="sm:hidden">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-1 animate-pulse"></div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-14 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-18 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Desktop layout skeleton */}
                <div className="hidden sm:contents">
                  <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="hidden md:block h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="hidden lg:block h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="flex justify-center">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 