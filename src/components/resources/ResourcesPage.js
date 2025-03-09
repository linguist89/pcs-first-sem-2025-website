'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ResourcesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeResourceId, setActiveResourceId] = useState(null);
  
  useEffect(() => {
    // Fetch resources data from JSON file
    const fetchResources = async () => {
      try {
        const response = await fetch('/data/resources.json');
        const data = await response.json();
        setCategories(data.categories);
        setResources(data.resources);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading resources:', error);
        setIsLoading(false);
      }
    };
    
    fetchResources();
  }, []);
  
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        setActiveResourceId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Filter resources based on active category
  const filteredResources = resources.filter(
    resource => activeCategory === 'all' || resource.category === activeCategory
  );
  
  // Get active resource
  const activeResource = activeResourceId 
    ? resources.find(r => r.id === activeResourceId) 
    : null;

  // Close popup on escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        setActiveResourceId(null);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-bg-secondary py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-text-primary">Resources</h1>
          <div className="flex flex-wrap gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-10 w-32 bg-bg-primary animate-pulse rounded-md"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-bg-primary animate-pulse rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || '';
  };
  
  return (
    <div className="bg-bg-secondary py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-text-primary">Resources</h1>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-bg-primary text-text-primary hover:bg-bg-accent'
              }`}
            >
              {category.icon && <span className="mr-2">{category.icon}</span>}
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Resources grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-text-secondary">No resources found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <div key={resource.id} className="group bg-bg-primary rounded-lg overflow-hidden shadow-light hover:shadow-medium transition-shadow border border-border-light">
                <div className="relative h-40">
                  <Image
                    src={resource.thumbnail}
                    alt={resource.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  
                  {/* Category Tag */}
                  <div className="absolute top-2 left-2">
                    <div className="bg-primary text-white text-xs px-2 py-1 rounded-md">
                      {categories.find(cat => cat.id === resource.category)?.name || resource.category}
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-bg-primary bg-opacity-80 text-text-primary text-xs px-2 py-1 rounded-md flex items-center">
                      {resource.type}
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {resource.description}
                  </p>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center">
                      <span className="mr-2">{getCategoryIcon(resource.category)}</span>
                      <span className="text-sm text-text-secondary">
                        {resource.size || resource.duration || ''}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveResourceId(resource.id)}
                      className="text-primary hover:text-primary-dark transition-colors font-medium text-sm flex items-center"
                    >
                      <span>View Resource</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-text-secondary">
                    Added: {resource.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Resource Detail Popup */}
        {activeResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-neutral-dark bg-opacity-50">
            <div className="bg-bg-primary max-w-2xl w-full mx-4 rounded-lg shadow-lg overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="relative h-48">
                <Image
                  src={activeResource.thumbnail}
                  alt={activeResource.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover"
                />
                <button 
                  onClick={() => setActiveResourceId(null)} 
                  className="absolute top-2 right-2 bg-bg-primary bg-opacity-80 p-2 rounded-full text-text-primary hover:text-primary hover:bg-bg-accent transition-colors flex items-center justify-center shadow-light"
                  aria-label="Close popup"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-bg-primary to-transparent py-8">
                  <div className="px-6 pt-20">
                    <div className="flex items-center">
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded-md mr-2">
                        {categories.find(cat => cat.id === activeResource.category)?.name || activeResource.category}
                      </span>
                      <span className="bg-bg-primary bg-opacity-80 text-text-primary text-xs px-2 py-1 rounded-md">
                        {activeResource.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-text-primary mb-2">{activeResource.title}</h2>
                <p className="text-text-secondary mb-6">{activeResource.description}</p>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-text-primary mb-2">About this resource</h3>
                  <p className="text-text-secondary mb-4">
                    This {activeResource.type.toLowerCase()} contains valuable information about {activeResource.title.toLowerCase()}. 
                    It's designed to help you understand the core concepts and apply them in real-world projects.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="bg-bg-secondary py-1 px-3 rounded-md text-text-secondary text-sm">
                      <span className="font-medium text-text-primary mr-2">Type:</span> {activeResource.type}
                    </div>
                    <div className="bg-bg-secondary py-1 px-3 rounded-md text-text-secondary text-sm">
                      <span className="font-medium text-text-primary mr-2">Size:</span> {activeResource.size || activeResource.duration || 'N/A'}
                    </div>
                    <div className="bg-bg-secondary py-1 px-3 rounded-md text-text-secondary text-sm">
                      <span className="font-medium text-text-primary mr-2">Added:</span> {activeResource.date}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border-light pt-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <Link 
                      href={activeResource.url}
                      target={activeResource.url.startsWith('http') ? "_blank" : "_self"}
                      className="text-primary-dark hover:underline text-sm font-medium"
                    >
                      Visit original resource
                    </Link>
                    
                    <button
                      onClick={() => alert("You would add the specific resource at the backend for your users to download")}
                      className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Resource
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage; 