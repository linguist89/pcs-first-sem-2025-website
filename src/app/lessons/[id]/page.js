import LessonDetail from '@/components/lessons/LessonDetail';

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  return {
    title: `Lesson ${id} - EdTech Course`,
    description: 'Detailed lesson content with interactive learning materials.',
  };
}

export default async function Lesson({ params }) {
  const { id } = await params;
  
  return <LessonDetail lessonId={id} />;
} 