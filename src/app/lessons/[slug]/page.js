'use client';

import { motion } from 'framer-motion';
import lessonsData from '../../../../public/data/lessons.json';

export async function generateStaticParams() {
  return lessonsData.map((lesson) => ({
    slug: lesson.slug,
  }));
}

const CaseStudyCard = ({ study, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-background-secondary rounded-lg shadow-md overflow-hidden mb-6 transform hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-primary-color">{study.title}</h3>
          <span className="bg-accent-color text-text-inverse px-3 py-1 rounded-full text-sm">
            {study.year}
          </span>
        </div>
        <p className="text-text-primary mb-4">{study.description}</p>
        <div className="bg-background-accent p-4 rounded-md mb-4">
          <h4 className="font-semibold text-text-primary mb-2">Data Type Issue:</h4>
          <p className="text-text-secondary">{study.data_type_issue}</p>
        </div>
        <div className="text-sm text-text-secondary italic">
          Source: {study.source}
        </div>
      </div>
    </motion.div>
  );
};

export default function LessonPage({ params }) {
  const lesson = lessonsData.find((l) => l.slug === params.slug);

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-text-primary">{lesson.title}</h1>
      <div className="prose prose-lg max-w-none">
        {lesson.content && (
          <>
            <p className="text-lg mb-8 text-text-primary">{lesson.content.introduction}</p>
            {lesson.content.sections?.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-text-primary">{section.title}</h2>
                <div className="whitespace-pre-wrap text-text-secondary">{section.content}</div>
              </div>
            ))}
            
            {lesson.content.case_studies && (
              <div className="mt-16">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-bold mb-8 text-primary-color"
                >
                  Real-World Case Studies: Data Type Disasters
                </motion.h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {lesson.content.case_studies.map((study, index) => (
                    <CaseStudyCard key={index} study={study} index={index} />
                  ))}
                </div>
              </div>
            )}

            {lesson.content.summary && (
              <div className="mt-12 p-6 bg-background-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-text-primary">Summary</h3>
                <p className="text-text-secondary">{lesson.content.summary}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 