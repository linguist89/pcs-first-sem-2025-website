"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

const LessonCard = ({ lesson }) => {
  return (
    <Link href={`/lessons/${lesson.slug}`} className="block group">
      <motion.div 
        className="card h-full overflow-hidden relative border border-border-light/30 bg-gradient-to-b from-bg-primary to-bg-primary/95"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
      >
        {/* Accent border at top */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent w-full"></div>
        
        <div className="p-8 flex flex-col h-full">
          {/* Status tag */}
          <div className="flex justify-between items-center mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              Beginner
            </span>
            <motion.button 
              className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-bg-accent transition-colors duration-300"
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
            </motion.button>
          </div>
          
          {/* Icon and title */}
          <div className="mb-6">
            <div className="flex items-start mb-4">
              <motion.div 
                className="w-16 h-16 text-primary mr-5 bg-bg-accent p-3 rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {lesson.icon}
              </motion.div>
              <h3 className="text-2xl font-bold group-hover:text-primary transition-colors duration-300 leading-tight">
                {lesson.title}
              </h3>
            </div>
            
            {/* Description with better typography */}
            <p className="text-text-secondary mb-6 text-base leading-relaxed">
              {lesson.description}
            </p>
          </div>
          
          {/* Topics list preview */}
          <div className="mb-6">
            <h4 className="text-sm uppercase tracking-wider text-text-secondary mb-3 font-medium">Topics covered</h4>
            <ul className="space-y-2">
              {lesson.topics.slice(0, 3).map((topic, index) => (
                <li key={index} className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-primary)" className="w-4 h-4 mr-2 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span>{topic}</span>
                </li>
              ))}
              {lesson.topics.length > 3 && (
                <li className="text-sm text-primary">+{lesson.topics.length - 3} more topics</li>
              )}
            </ul>
          </div>
          
          {/* Progress section */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your progress</span>
              <span className="text-sm text-primary font-medium">0%</span>
            </div>
            <div className="w-full bg-bg-accent h-2 rounded-full overflow-hidden mb-6">
              <motion.div 
                className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                initial={{ width: "0%" }}
                whileInView={{ width: "0%" }}
                transition={{ duration: 1 }}
              ></motion.div>
            </div>
            
            {/* CTA Button */}
            <motion.div 
              className="btn btn-primary ripple inline-flex w-full justify-center text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Learning
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default LessonCard; 