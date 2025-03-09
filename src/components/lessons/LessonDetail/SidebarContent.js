'use client';

const SidebarContent = ({ sections, activeIndex, setActiveIndex, lesson, setShowSidebar }) => (
  <>
    <div className="flex items-center justify-between mb-4 lg:mb-6">
      <h3 className="font-bold text-text-primary text-lg">Lesson Content</h3>
      <button 
        onClick={() => setShowSidebar(false)}
        className="lg:hidden p-2 text-text-secondary hover:text-primary transition-colors"
        aria-label="Close sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    {lesson && (
      <div className="mb-4 p-4 bg-bg-secondary rounded-lg">
        <h1 className="font-bold text-text-primary text-xl mb-2">{lesson.title}</h1>
        <div className="text-sm text-text-secondary">{lesson.description}</div>
      </div>
    )}
    
    <nav className="mt-2 space-y-1">
      {sections.map((section, index) => (
        <button
          key={index}
          onClick={() => {
            setActiveIndex(index);
            setShowSidebar(false);
          }}
          className={`w-full text-left p-3 rounded-md flex items-center transition-colors ${
            activeIndex === index
              ? 'bg-primary text-white font-medium'
              : 'hover:bg-bg-secondary text-text-secondary'
          }`}
        >
          <div className="mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-current text-xs">
            {index + 1}
          </div>
          {section.title}
        </button>
      ))}
    </nav>
  </>
);

export default SidebarContent; 