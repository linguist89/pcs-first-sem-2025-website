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
    <section className="py-32 md:py-40 overflow-hidden relative">
      {/* New modern abstract shapes background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric elements - only rectangular shapes */}
        <motion.div 
          className="absolute top-[30%] right-[20%] w-32 h-32 bg-accent/5 rounded-lg rotate-12"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 12 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
        <motion.div 
          className="absolute bottom-[20%] left-[25%] w-40 h-40 bg-primary/5 rounded-lg -rotate-12"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: -12 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        />

        {/* Subtle lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent w-full"
              style={{ top: `${20 + i * 15}%` }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 2, delay: 0.1 * i, ease: "easeOut" }}
            />
          ))}
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-secondary/15 to-transparent h-full"
              style={{ left: `${30 + i * 20}%` }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 2, delay: 0.2 * i, ease: "easeOut" }}
            />
          ))}
        </div>
        
        {/* Grid pattern with reduced opacity */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row-reverse items-center justify-between gap-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="md:w-5/12">
            <div className="relative">
              {/* Code Snippet Panels */}
              <div className="relative w-full h-[450px]">
                <motion.div 
                  className="absolute p-5 bg-gradient-to-br from-bg-primary to-primary/5 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-sm z-30"
                  style={{ left: '0%', top: '5%' }}
                  initial={{ opacity: 0, x: -50, y: 50, rotate: -3 }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: -3 }}
                  transition={{ duration: 0.7, delay: 0.7 }}
                  whileHover={{ scale: 1.02, rotate: -2 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-error-color mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-warning-color mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-success-color mr-2"></div>
                    <span className="text-xs text-text-secondary ml-2 font-mono">data_import.py</span>
                  </div>
                  <pre className="text-sm font-mono bg-neutral-dark/40 p-3 rounded-lg">
                    <code className="text-primary whitespace-pre-wrap">
                      <span className="text-secondary">import</span> pandas <span className="text-secondary">as</span> pd
                      <span className="text-secondary">import</span> numpy <span className="text-secondary">as</span> np

                      <span className="text-accent"># Load cognitive data</span>
                      data = pd.read_csv(<span className="text-success-color">'data.csv'</span>)
                    </code>
                  </pre>
                </motion.div>
                
                <motion.div 
                  className="absolute p-5 bg-gradient-to-br from-bg-primary to-secondary/5 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-sm z-20"
                  style={{ left: '10%', top: '40%' }}
                  initial={{ opacity: 0, x: 50, y: -50, rotate: 2 }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: 2 }}
                  transition={{ duration: 0.7, delay: 1 }}
                  whileHover={{ scale: 1.02, rotate: 3 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-error-color mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-warning-color mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-success-color mr-2"></div>
                    <span className="text-xs text-text-secondary ml-2 font-mono">plot.py</span>
                  </div>
                  <pre className="text-sm font-mono bg-neutral-dark/40 p-3 rounded-lg">
                    <code className="text-secondary whitespace-pre-wrap">
                      <span className="text-secondary">import</span> matplotlib.pyplot <span className="text-secondary">as</span> plt

                      <span className="text-accent"># Visualize results</span>
                      plt.plot(results)
                      plt.title(<span className="text-success-color">'Results'</span>)
                    </code>
                  </pre>
                </motion.div>
                
                <motion.div 
                  className="absolute p-5 bg-gradient-to-br from-bg-primary to-accent/5 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-sm z-10"
                  style={{ left: '20%', top: '75%' }}
                  initial={{ opacity: 0, y: 50, rotate: -1 }}
                  animate={{ opacity: 1, y: 0, rotate: -1 }}
                  transition={{ duration: 0.7, delay: 1.3 }}
                  whileHover={{ scale: 1.02, rotate: 0 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-error-color mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-warning-color mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-success-color mr-2"></div>
                    <span className="text-xs text-text-secondary ml-2 font-mono">model.py</span>
                  </div>
                  <pre className="text-sm font-mono bg-neutral-dark/40 p-3 rounded-lg">
                    <code className="text-accent whitespace-pre-wrap">
                      <span className="text-secondary">from</span> sklearn.linear_model <span className="text-secondary">import</span> LinearRegression

                      model = LinearRegression()
                      model.fit(X_train, y_train)
                    </code>
                  </pre>
                </motion.div>
              </div>
            </div>
          </div>
          
          <div className="md:w-6/12">
            {/* Course label */}
            <motion.div 
              className="inline-flex items-center bg-primary/10 backdrop-blur-sm px-5 py-2 rounded-full mb-8 shadow-sm"
              variants={itemVariants}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse mr-3"></span>
              <span className="text-sm font-medium tracking-wide">First Semester 2025</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
              variants={itemVariants}
            >
              Python for <span className="font-yellowtail">Cognitive Science</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-text-secondary mb-10 max-w-xl leading-relaxed"
              variants={itemVariants}
            >
              Build your skills from beginner to advanced with hands-on 
              projects and real-world applications in cognitive science research.
            </motion.p>
          </div>
        </motion.div>
      </div>
      
      {/* Modern wave separator */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full text-bg-secondary fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero; 