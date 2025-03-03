"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import lessons from '@/app/lessonData';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.slug) {
      const foundLesson = lessons.find(l => l.slug === params.slug);
      
      if (!foundLesson || !foundLesson.visible) {
        router.push('/not-found');
      } else {
        setLesson(foundLesson);
      }
      setLoading(false);
    }
  }, [params, router]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-24 bg-gray-300 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="h-64 bg-gray-300 rounded"></div>
              <div className="md:col-span-2 h-96 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return null;
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
                {lesson.content?.introduction && (
                  <p>{lesson.content.introduction}</p>
                )}
                
                {lesson.content?.sections && lesson.content.sections.map((section, index) => (
                  <div key={index} className="mt-6">
                    <h3>{section.title}</h3>
                    <div dangerouslySetInnerHTML={{ __html: formatContentWithCode(section.content) }} />
                  </div>
                ))}
                
                {!lesson.content?.sections && (
                  <>
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
                  </>
                )}
                
                {lesson.content?.summary && (
                  <div className="bg-bg-accent p-4 rounded-lg border-l-4 border-primary mt-8">
                    <h3 className="text-lg font-medium">Summary</h3>
                    <p>{lesson.content.summary}</p>
                  </div>
                )}
                
                {!lesson.content?.summary && (
                  <div className="bg-bg-accent p-4 rounded-lg border-l-4 border-primary mt-8">
                    <h3 className="text-lg font-medium">Getting Started</h3>
                    <p>
                      To prepare for this lesson, make sure you have Python installed on your computer
                      and have completed any prerequisite lessons.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to format content with code blocks
function formatContentWithCode(content) {
  if (!content) return '';
  
  // This regex matches markdown code blocks with language specification
  return content.replace(/```(\w+)\n([\s\S]+?)\n```/g, (match, language, code) => {
    return `<pre class="language-${language}"><code>${escapeHtml(code)}</code></pre>`;
  });
}

// Helper function to escape HTML
function escapeHtml(html) {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return html.replace(/[&<>"']/g, match => escapeMap[match]);
} 