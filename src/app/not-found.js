import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Page Not Found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        We couldn't find the page you're looking for. It may have been moved or doesn't exist.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/"
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors text-center"
        >
          Go to Home
        </Link>
        <Link 
          href="/lessons"
          className="bg-white border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary hover:text-white transition-colors text-center"
        >
          Browse Lessons
        </Link>
      </div>
    </div>
  );
} 