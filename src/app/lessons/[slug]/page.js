import lessonsData from '../../../../public/data/lessons.json';

export async function generateStaticParams() {
  return lessonsData.map((lesson) => ({
    slug: lesson.slug,
  }));
}

export default function LessonPage({ params }) {
  const lesson = lessonsData.find((l) => l.slug === params.slug);

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">{lesson.title}</h1>
      <div className="prose prose-lg max-w-none">
        {lesson.content && (
          <>
            <p className="text-lg mb-8">{lesson.content.introduction}</p>
            {lesson.content.sections?.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <div className="whitespace-pre-wrap">{section.content}</div>
              </div>
            ))}
            {lesson.content.summary && (
              <div className="mt-12 p-6 bg-bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-4">Summary</h3>
                <p>{lesson.content.summary}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 