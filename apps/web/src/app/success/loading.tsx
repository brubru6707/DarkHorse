// apps/web/src/app/success/loading.tsx
export default function Loading() {
    // You can add any loading UI here
    return (
      <>
        {/* Include Header and Footer if they are always present on pages */}
        <header className="py-4 px-6 bg-transparent text-green-300">
          {/* Your Header content or a placeholder */}
          <nav className="flex items-center justify-between container mx-auto">
            <span className="text-2xl font-bold">DarkHorse</span>
            <div className="flex items-center space-x-4">
              {/* Placeholder for navigation links */}
            </div>
          </nav>
        </header>
        <div className="min-h-screen text-green-300 flex flex-col items-center justify-center py-12 px-4 font-inter text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-6 animate-pulse">
            Loading Payment Status...
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl">
            Please wait while we process your request.
          </p>
          {/* You could add a spinner here */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
        {/* Include Footer if it's always present */}
        <footer className="py-6 px-6 bg-transparent text-gray-400 text-center">
          {/* Your Footer content or a placeholder */}
          &copy; 2025 DarkHorse
        </footer>
      </>
    );
  }