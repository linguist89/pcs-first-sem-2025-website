import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-primary">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 60" stroke="rgba(255,255,255,0.2)" strokeWidth="1"></path>
              <path d="M 0 30 L 30 0 M 60 30 L 30 60" stroke="rgba(255,255,255,0.1)" strokeWidth="1"></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)"></rect>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Python for Cognitive Science
            </h1>
            <p className="text-lg text-white mb-8">
              Learn functional programming in Python with applications in cognitive science, data analysis, and machine learning, designed specifically for students exploring the intersection of computation and the mind.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/lessons" className="px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-white/90 transition-colors text-center shadow-md">
                Start Learning
              </Link>
              <Link href="/resources" className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-white hover:bg-opacity-10 transition-colors text-center">
                Explore Resources
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">3+</span>
                <span className="text-white">Modules</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">12+</span>
                <span className="text-white">Exercises</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">5+</span>
                <span className="text-white">Projects</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <Image 
                src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                alt="Cognitive science student programming in Python" 
                width={800} 
                height={450}
                className="object-cover"
              />
              
              {/* Overlay Elements */}
              <div className="absolute bottom-4 right-4 bg-bg-primary p-3 rounded-md shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent-color rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-text-primary">First Semester 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 