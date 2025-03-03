import BrainCode from './icons/BrainCode';

const Hero = () => {
  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Python for <span className="text-primary">Cognitive Science</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8">
              Learn Python programming fundamentals to prepare for your machine learning journey in Cognitive Science.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#lessons" className="btn btn-primary ripple">
                Start Learning
              </a>
              <a href="#" className="btn bg-transparent border border-primary text-primary hover:bg-primary/10 ripple">
                Course Resources
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <BrainCode className="w-full max-w-md" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 