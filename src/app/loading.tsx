export default function Loading() {
  return (
    <main className="container mx-auto py-8">
      {/* Search and Filter skeleton */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 h-12 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-48 h-12 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      {/* Country List skeleton */}
      <div className="bg-theme border border-theme rounded-lg overflow-hidden">
        {/* Header skeleton */}
        <div className="grid grid-cols-6 gap-4 p-4 border-b border-theme bg-gray-100">
          {['Flag', 'Name', 'Population', 'Region', 'Capital', 'Favorite'].map((header, i) => (
            <div key={i} className={`h-4 bg-gray-200 rounded animate-pulse ${i >= 2 ? 'hidden sm:block' : ''} ${i >= 3 ? 'hidden md:block' : ''} ${i >= 4 ? 'hidden lg:block' : ''}`}></div>
          ))}
        </div>

        {/* Country rows skeleton */}
        <div className="divide-y divide-theme">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="grid border-b border-theme grid-cols-6 gap-4 p-4 items-center">
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="hidden sm:block h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="hidden md:block h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="hidden lg:block h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex justify-center">
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 