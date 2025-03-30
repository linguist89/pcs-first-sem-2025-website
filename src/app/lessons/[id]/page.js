// This is a server component that handles the params
import LessonPageClient from '@/components/lessons/LessonPageClient';

export default function LessonPage({ params }) {
  return <LessonPageClient lessonId={params.id} />;
} 