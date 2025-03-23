import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = params;
  
  // If no ID, use default title
  if (!id) {
    return {
      title: 'Lesson Not Found - Python for Cognitive Science',
      description: 'The requested lesson could not be found.',
    };
  }
  
  // Fetch lesson metadata if needed
  // For now, using a simple title
  return {
    title: `Lesson ${id} - Python for Cognitive Science`,
    description: 'Detailed lesson content with interactive learning materials.',
  };
} 