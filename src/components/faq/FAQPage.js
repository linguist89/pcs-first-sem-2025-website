"use client";

import { useState, useEffect } from 'react';
import FAQAccordion from './FAQAccordion';
import FAQCategories from './FAQCategories';
import faqData from '../../../public/data/faq.json';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredFAQs, setFilteredFAQs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Add 'all' category to the categories list
  const allCategories = [
    { id: 'all', name: 'All Questions', icon: '🔍' },
    ...faqData.faqCategories
  ];

  useEffect(() => {
    let filtered = faqData.faqs;
    
    // Filter by category if not 'all'
    if (activeCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === activeCategory);
    }
    
    // Filter by search query if one exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        faq => 
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
      );
    }
    
    setFilteredFAQs(filtered);
  }, [activeCategory, searchQuery]);

  return (
    <div className="bg-bg-secondary py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-text-primary">Frequently Asked Questions</h1>
        
        <div className="max-w-4xl mx-auto">
          {/* Search input */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pr-12 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-bg-primary text-text-primary"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
                🔍
              </span>
            </div>
          </div>
          
          {/* Categories */}
          <FAQCategories 
            categories={allCategories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
          
          {/* FAQ List */}
          {filteredFAQs.length > 0 ? (
            <div className="bg-bg-primary rounded-lg shadow-light border border-border-light">
              {filteredFAQs.map((faq) => (
                <FAQAccordion 
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-bg-primary rounded-lg border border-border-light">
              <p className="text-lg mb-2 text-text-secondary">No matching questions found</p>
              <p className="text-text-secondary">Try adjusting your search or category filter</p>
            </div>
          )}
          
          {/* Contact section */}
          <div className="mt-12 p-6 bg-bg-primary rounded-lg text-center shadow-light border border-border-light">
            <h2 className="text-2xl font-semibold text-text-primary mb-3">Still have questions?</h2>
            <p className="text-text-secondary mb-4">
              Our support team is here to help you with any questions or issues you might have.
            </p>
            <button className="px-6 py-3 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors duration-200">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 