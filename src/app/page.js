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
      
      {/* Features section */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-accent/20 to-primary/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-secondary/10 to-primary/5 blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-block py-1.5 px-5 bg-secondary/10 text-secondary text-sm font-semibold rounded-full mb-4 border border-secondary/20">
                Benefits
              </span>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-5 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Why Learn With Us?
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Our course is specifically designed for Cognitive Science students with a focus on practical skills
              and real-world applications in research and data analysis.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div 
              className="card p-10 border border-border-light/30 bg-gradient-to-b from-bg-primary to-bg-primary/95"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
            >
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-primary/10 flex justify-center items-center mb-8 mx-auto"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-primary)" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-center">Domain-Specific Content</h3>
              <p className="text-text-secondary text-center leading-relaxed">
                Examples and exercises tailored to cognitive science applications and research.
                You'll learn to analyze real cognitive data sets from the start.
              </p>
            </motion.div>
            
            <motion.div 
              className="card p-10 border border-border-light/30 bg-gradient-to-b from-bg-primary to-bg-primary/95"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
            >
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-secondary/10 flex justify-center items-center mb-8 mx-auto"
                whileHover={{ rotate: -5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-secondary)" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-center">Practical Approach</h3>
              <p className="text-text-secondary text-center leading-relaxed">
                Hands-on learning with real-world datasets and cognitive science case studies. 
                Build working projects that solve research problems.
              </p>
            </motion.div>
            
            <motion.div 
              className="card p-10 border border-border-light/30 bg-gradient-to-b from-bg-primary to-bg-primary/95"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
            >
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-accent/10 flex justify-center items-center mb-8 mx-auto"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-accent)" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-center">Fast-Track Learning</h3>
              <p className="text-text-secondary text-center leading-relaxed">
                Focused curriculum that quickly builds the skills needed for machine learning applications in 
                cognitive research and experimentation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
