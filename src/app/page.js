"use client";

import Hero from '@/components/Hero';
import LessonCard from '@/components/LessonCard';
import lessons from './lessonData';
import { motion } from 'framer-motion';

export default function Home() {
  // Filter lessons to only show those that are visible
  const visibleLessons = lessons.filter(lesson => lesson.visible);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <Hero />
      
      {/* Lessons section */}
      <section id="lessons" className="py-24 bg-bg-secondary relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-gradient-to-b from-primary/10 to-secondary/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] translate-y-1/3 -translate-x-1/4 rounded-full bg-gradient-to-t from-primary/10 to-secondary/5 blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Course Lessons
            </motion.h2>
          </motion.div>
          
          {/* Lessons grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
