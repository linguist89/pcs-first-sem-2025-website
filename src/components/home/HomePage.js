import Hero from './Hero';
import PurposeAndGoals from './PurposeAndGoals';
import LessonList from '@/components/lessons/LessonList';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <PurposeAndGoals />
      
      {/* Lessons Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Course Lessons</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive Python lessons designed for cognitive science students.
              Each lesson provides practical skills and real-world applications.
            </p>
          </div>
          
          <LessonList />
        </div>
      </section>
    </main>
  );
};

export default HomePage; 