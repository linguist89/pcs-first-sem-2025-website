'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';
import ModernLessonDetail from '@/components/lessons/ModernLessonDetail';

export default function Lesson({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  // Redirect to the lessons page if ID is missing or undefined
  if (!id || id === 'undefined') {
    return notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ModernLessonDetail lessonId={id} />
    </div>
  );
} 