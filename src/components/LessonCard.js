import Link from 'next/link';

const LessonCard = ({ lesson }) => {
  return (
    <Link href={`/lessons/${lesson.slug}`} className="block">
      <div className="card hover:shadow-elevation-3 transition-all h-full">
        <div className="p-6 flex flex-col h-full">
          <div className="mb-4 flex justify-center">
            <div className="w-24 h-24 text-primary">
              {lesson.icon}
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
          <p className="text-text-secondary flex-grow mb-4">{lesson.description}</p>
          <div className="mt-auto">
            <span className="btn btn-primary ripple inline-flex">
              Explore Lesson
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LessonCard; 