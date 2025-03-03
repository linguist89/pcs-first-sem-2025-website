"use client";

import BrainCode from './icons/BrainCode';
import { motion } from 'framer-motion';

const Hero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-24 md:py-32 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/10 blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-secondary/20 to-accent/10 blur-3xl"></div>
        <div className="absolute -bottom-20 right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-accent/20 to-primary/10 blur-3xl"></div>
        
        {/* Grid pattern with reduced opacity */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="md:w-1/2 mb-16 md:mb-0">
            {/* Course label */}
            <motion.div 
              className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-full mb-8 shadow-sm"
              variants={itemVariants}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse mr-3"></span>
              <span className="text-sm font-medium tracking-wide">First Semester 2025</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-8 leading-tight"
              variants={itemVariants}
            >
              Python for{' '}
              <div className="relative inline-block">
                <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-accent">
                  Cognitive Science
                </span>
                <motion.div 
                  className="absolute -bottom-2 left-0 h-2 bg-gradient-to-r from-primary via-secondary to-accent w-full rounded-full opacity-30"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1 }}
                ></motion.div>
              </div>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-text-secondary mb-10 max-w-xl leading-relaxed"
              variants={itemVariants}
            >
              Master Python programming fundamentals and unlock the potential of 
              data analysis and machine learning for cognitive science research.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-5 mb-16"
              variants={itemVariants}
            >
              <motion.a 
                href="#lessons" 
                className="btn btn-primary ripple text-base py-3 px-8 shadow-lg shadow-primary/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Learning
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </motion.a>
              <motion.a 
                href="#" 
                className="btn border-2 border-primary/50 bg-transparent text-primary hover:bg-primary/5 ripple text-base py-3 px-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Course Resources
              </motion.a>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6"
              variants={itemVariants}
            >
              <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold text-primary">7</div>
                <div className="text-sm text-text-secondary">Core Lessons</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold text-secondary">35+</div>
                <div className="text-sm text-text-secondary">Learning Topics</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold text-accent">100%</div>
                <div className="text-sm text-text-secondary">Beginner Friendly</div>
              </div>
            </motion.div>
          </div>
          
          <div className="md:w-1/2 flex justify-center md:justify-end relative">
            {/* Glowing background for illustration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl"></div>
            
            {/* Floating code snippets with animations */}
            <motion.div 
              className="absolute -top-10 left-10 p-4 bg-bg-primary rounded-xl shadow-xl border border-border-light/20"
              initial={{ opacity: 0, x: -50, y: 50, rotate: -5 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: -5 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <pre className="text-sm font-mono text-primary"><code>import pandas as pd</code></pre>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-5 right-10 p-4 bg-bg-primary rounded-xl shadow-xl border border-border-light/20"
              initial={{ opacity: 0, x: 50, y: -50, rotate: 5 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 5 }}
              transition={{ duration: 0.7, delay: 1 }}
            >
              <pre className="text-sm font-mono text-secondary"><code>plt.plot(results)</code></pre>
            </motion.div>
            
            <motion.div 
              className="absolute top-1/3 right-0 p-4 bg-bg-primary rounded-xl shadow-xl border border-border-light/20"
              initial={{ opacity: 0, x: 50, rotate: 3 }}
              animate={{ opacity: 1, x: 0, rotate: 3 }}
              transition={{ duration: 0.7, delay: 1.3 }}
            >
              <pre className="text-sm font-mono text-accent"><code>model.fit(X, y)</code></pre>
            </motion.div>
            
            {/* Main illustration with animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.3,
                type: "spring",
                stiffness: 100
              }}
              className="relative z-10"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut" 
                }}
              >
                <BrainCode className="w-full max-w-xl drop-shadow-2xl" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full text-bg-secondary fill-current">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero; 