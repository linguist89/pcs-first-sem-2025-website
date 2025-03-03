import Link from 'next/link';
import lessons from '@/app/lessonData';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return lessons.map(lesson => ({
    slug: lesson.slug,
  }));
}

export function generateMetadata({ params }) {
  const lesson = lessons.find(lesson => lesson.slug === params.slug);
  
  if (!lesson) {
    return {
      title: 'Lesson Not Found',
    };
  }
  
  return {
    title: `${lesson.title} | Python for Cognitive Science`,
    description: lesson.description,
  };
}

export default function LessonPage({ params }) {
  const lesson = lessons.find(lesson => lesson.slug === params.slug);
  
  if (!lesson) {
    notFound();
  }
  
  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Lesson header */}
        <div className="mb-8">
          <Link href="/#lessons" className="text-primary flex items-center mb-4 hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to all lessons
          </Link>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 text-primary">
              {lesson.icon}
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{lesson.title}</h1>
              <p className="text-lg text-text-secondary">{lesson.description}</p>
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Topics Covered</h3>
              <ul className="space-y-2">
                {lesson.topics.map((topic, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-primary)" className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Lesson Navigation</h3>
                <div className="flex flex-col space-y-2">
                  <button className="btn btn-primary ripple justify-start">
                    Start Lesson
                  </button>
                  <button className="btn bg-transparent border border-primary text-primary hover:bg-primary/10 ripple justify-start">
                    Download Materials
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-2">
            <div className="card p-8">
              <div className="prose max-w-none">
                <h2>Welcome to {lesson.title}</h2>
                <p>
                  This lesson is under development. Check back soon for the complete content.
                </p>
                <p>
                  In this lesson, you'll learn about:
                </p>
                <ul>
                  {lesson.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
                
                <div className="bg-bg-accent p-4 rounded-lg border-l-4 border-primary mt-8">
                  <h3 className="text-lg font-medium">Getting Started</h3>
                  <p>
                    To prepare for this lesson, make sure you have Python installed on your computer
                    and have completed any prerequisite lessons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 