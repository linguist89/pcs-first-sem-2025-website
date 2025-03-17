import Link from 'next/link';

export default function LessonNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Lesson Not Found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        We couldn't find the lesson you're looking for. It may have been moved or doesn't exist.
      </p>
      <Link 
        href="/lessons"
        className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
      >
        Browse All Lessons
      </Link>
    </div>
  );
} 