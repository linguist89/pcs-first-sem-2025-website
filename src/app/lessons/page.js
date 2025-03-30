import Link from 'next/link';
import { getAllLessonsMetadata } from '@/lib/lessons';

export const metadata = {
  title: 'Lessons - EdTech Course',
  description: 'Browse and access all lessons and educational content.',
};

export default async function LessonsPage() {
  // Get all lessons metadata
  const lessons = await getAllLessonsMetadata();
  
  // Sort lessons by ID
  const sortedLessons = [...lessons].sort((a, b) => {
    const aId = parseInt(a.id, 10);
    const bId = parseInt(b.id, 10);
    return aId - bId;
  });

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">Python for Cognitive Science</h1>
      <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
        A comprehensive course teaching Python programming fundamentals with applications in data analysis
        for cognitive science research.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedLessons.map((lesson) => (
          <Link 
            href={`/lessons/${lesson.id}`}
            key={lesson.id}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                {lesson.difficulty && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {lesson.difficulty}
                  </span>
                )}
                {lesson.duration && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {lesson.duration}
                  </span>
                )}
              </div>
              
              <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
              
              {lesson.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">{lesson.description}</p>
              )}
              
              <span className="text-blue-600 font-medium inline-flex items-center group">
                Start Lesson
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
      
      {sortedLessons.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-yellow-700 mb-2">No Lessons Available</h3>
          <p className="text-yellow-600">Check back soon as we're adding new lessons regularly!</p>
        </div>
      )}
    </div>
  );
} 