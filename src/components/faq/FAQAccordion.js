"use client";

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function FAQAccordion({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-b-border-light last:border-b-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 px-4 flex justify-between items-center gap-4 hover:bg-bg-secondary text-left transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <h3 className="font-medium text-lg text-text-primary">{question}</h3>
        <ChevronDownIcon 
          className={`w-5 h-5 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 py-4 px-6' : 'max-h-0'}`}
      >
        <p className="text-text-secondary">{answer}</p>
      </div>
    </div>
  );
} 