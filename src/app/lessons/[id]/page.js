import { redirect, notFound } from 'next/navigation';
import LessonDetail from '@/components/lessons/LessonDetail';

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  // If no ID, use default title
  if (!id) {
    return {
      title: 'Lesson Not Found - EdTech Course',
      description: 'The requested lesson could not be found.',
    };
  }
  
  return {
    title: `Lesson ${id} - EdTech Course`,
    description: 'Detailed lesson content with interactive learning materials.',
  };
}

export default async function Lesson({ params }) {
  const { id } = await params;
  
  // Redirect to the lessons page if ID is missing or undefined
  if (!id || id === 'undefined') {
    return notFound();
  }
  
  return <LessonDetail lessonId={id} />;
} 