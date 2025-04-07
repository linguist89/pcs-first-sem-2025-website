'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { FiCopy, FiCheck } from 'react-icons/fi';

const PythonConceptVisualizer = ({ conceptType = 'classes' }) => {
  const [activeNode, setActiveNode] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  
  // Function to handle copying code to clipboard
  const handleCopyCode = (code, stageId) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(stageId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Define the concept progressions for different types
  const conceptProgressions = {
    'functions': {
      stages: [
        {
          id: 'basic-functions',
          title: 'Basic Functions',
          description: 'Simple functions to perform specific tasks',
          code: 'def say_hello():\n    return "Hello, world!"\n\n# Call the function\nprint(say_hello())  # Output: Hello, world!\n\ndef double_five():\n    return 5 * 2\n\n# Call the function\nprint(f"Double of 5 is {double_five()}")',
          benefits: ['Code organization', 'Reusability', 'Readability']
        },
        {
          id: 'parameters',
          title: 'Function Parameters',
          description: 'Functions with various parameter types',
          code: 'def analyze_data(data, filter_type="all"):\n    if filter_type == "all":\n        return sum(data) / len(data)  # Average of all values\n    elif filter_type == "positive":\n        positive_values = [x for x in data if x > 0]\n        return sum(positive_values) / len(positive_values)  # Average of positive values\n    elif filter_type == "negative":\n        negative_values = [x for x in data if x < 0]\n        return sum(negative_values) / len(negative_values)  # Average of negative values\n\n# Example data\nnumbers = [10, -5, 7, -8, 12, -3, 6]\n\n# Call with different filter parameters\nprint(f"Average of all values: {analyze_data(numbers)}")\nprint(f"Average of positive values: {analyze_data(numbers, \'positive\')}")\nprint(f"Average of negative values: {analyze_data(numbers, \'negative\')}")',
          benefits: ['Flexibility', 'Default values', 'Named arguments']
        },
        {
          id: 'args',
          title: '*args',
          description: 'Accept any number of positional arguments',
          code: 'def sum_all(*numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total\n\n# Call with different numbers of arguments\nprint(f"Sum of 1, 2: {sum_all(1, 2)}")               # Output: 3\nprint(f"Sum of 1, 2, 3, 4, 5: {sum_all(1, 2, 3, 4, 5)}")  # Output: 15\nprint(f"Sum of nothing: {sum_all()}")                  # Output: 0',
          benefits: ['Variable argument count', 'Tuple packing', 'Function adaptability']
        },
        {
          id: 'kwargs',
          title: '**kwargs',
          description: 'Accept any number of keyword arguments',
          code: 'def filter_data(data, **filters):\n    result = data.copy()  # Start with a copy of the original data\n    \n    # Apply each filter\n    for key, value in filters.items():\n        if key == "min_value":\n            result = [x for x in result if x >= value]\n        elif key == "max_value":\n            result = [x for x in result if x <= value]\n        elif key == "exclude":\n            result = [x for x in result if x not in value]\n    \n    return result\n\n# Example data\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\n# Apply different filters with keyword arguments\nprint(f"Original data: {numbers}")\nprint(f"Values between 3 and 8: {filter_data(numbers, min_value=3, max_value=8)}")\nprint(f"Values 5 and above, excluding 7: {filter_data(numbers, min_value=5, exclude=[7])}")',
          benefits: ['Dynamic filtering options', 'Dictionary of arguments', 'Maximum flexibility']
        }
      ]
    },
    'classes': {
      stages: [
        {
          id: 'variables',
          title: 'Separate Variables',
          description: 'Individual variables for related data',
          code: 'title1 = "Book Title"\nauthor1 = "Author Name"\npages1 = 300\nis_checked_out1 = False\n\n# Need to track status separately\nif is_checked_out1:\n    status1 = "checked out"\nelse:\n    status1 = "available"\n\nprint(f"{title1} by {author1} ({pages1} pages) - {status1}")\n\n# Second book needs all new variables\ntitle2 = "Another Book"\nauthor2 = "Another Author"\npages2 = 250\nis_checked_out2 = True\n\n# Need to duplicate the status logic\nif is_checked_out2:\n    status2 = "checked out"\nelse:\n    status2 = "available"\n\nprint(f"{title2} by {author2} ({pages2} pages) - {status2}")',
          benefits: []
        },
        {
          id: 'functions',
          title: 'Functions with Parameters',
          description: 'Functions that operate on related data passed as parameters',
          code: 'def format_book(title, author, pages, is_checked_out):\n    status = "checked out" if is_checked_out else "available"\n    return f"{title} by {author} ({pages} pages) - {status}"\n\n# Need to pass each piece of data separately\nprint(format_book("Book Title", "Author Name", 300, False))\nprint(format_book("Another Book", "Another Author", 250, True))\n\n# To update status, need to call the function again with new parameters\nis_book2_checked_out = True  # Book 2 was checked out\nprint(format_book("Another Book", "Another Author", 250, is_book2_checked_out))\n\n# Now returned\nis_book2_checked_out = False  \nprint(format_book("Another Book", "Another Author", 250, is_book2_checked_out))',
          benefits: ['Code reuse', 'Single responsibility', 'Reduced duplication']
        },
        {
          id: 'classes',
          title: 'Classes',
          description: 'Bundle data with behavior in cohesive objects',
          code: 'class Book:\n    def __init__(self, title, author, pages):\n        self.title = title\n        self.author = author\n        self.pages = pages\n        self.is_checked_out = False  # Default state\n        \n    def check_out(self):\n        if not self.is_checked_out:\n            self.is_checked_out = True\n            return True\n        return False  # Already checked out\n        \n    def return_book(self):\n        if self.is_checked_out:\n            self.is_checked_out = False\n            return True\n        return False  # Already returned\n        \n    def format(self):\n        status = "checked out" if self.is_checked_out else "available"\n        return f"{self.title} by {self.author} ({self.pages} pages) - {status}"\n\n# Create book objects\nbook1 = Book("Book Title", "Author Name", 300)\nbook2 = Book("Another Book", "Another Author", 250)\n\n# Print initial state\nprint(book1.format())\nprint(book2.format())\n\n# Check out book2\nbook2.check_out()\nprint(book2.format())  # Updated state\n\n# Return book2\nbook2.return_book()\nprint(book2.format())  # Updated state again',
          benefits: ['Encapsulation', 'Data + behavior together', 'Instance-specific state', 'Object identity', 'Self-referential methods']
        }
      ]
    },
    'inheritance': {
      stages: [
        {
          id: 'single-class',
          title: 'Single Class',
          description: 'One class for one concept',
          code: 'class Book:\n    def __init__(self, title, author, pages):\n        self.title = title\n        self.author = author\n        self.pages = pages\n        self.is_checked_out = False\n        \n    def get_info(self):\n        status = "checked out" if self.is_checked_out else "available"\n        return f"{self.title} by {self.author} ({self.pages} pages) - {status}"\n        \n    def check_out(self):\n        self.is_checked_out = True\n        \n    def return_book(self):\n        self.is_checked_out = False\n\n# Create and use a Book object\nbook = Book("Python Programming", "John Smith", 350)\nprint(book.get_info())\nbook.check_out()\nprint(book.get_info())',
          benefits: ['Encapsulation', 'Object creation', 'Instance methods']
        },
        {
          id: 'duplicated-classes',
          title: 'Duplicated Classes',
          description: 'Similar classes with duplicated code',
          code: 'class Book:\n    def __init__(self, title, author, pages):\n        self.title = title\n        self.author = author\n        self.pages = pages\n        self.is_checked_out = False\n        \n    def get_info(self):\n        status = "checked out" if self.is_checked_out else "available"\n        return f"{self.title} by {self.author} ({self.pages} pages) - {status}"\n        \n    def check_out(self):\n        self.is_checked_out = True\n        \n    def return_book(self):\n        self.is_checked_out = False\n\n# Almost identical class with just one additional attribute and slightly modified method\nclass EBook:\n    def __init__(self, title, author, pages, format):\n        self.title = title\n        self.author = author\n        self.pages = pages\n        self.format = format  # New attribute\n        self.is_checked_out = False\n        \n    def get_info(self):\n        status = "checked out" if self.is_checked_out else "available"\n        return f"{self.title} by {self.author} ({self.pages} pages, {self.format}) - {status}"\n        \n    def check_out(self):\n        self.is_checked_out = True\n        \n    def return_book(self):\n        self.is_checked_out = False\n\n# Create and use both types\nphysical_book = Book("Python Programming", "John Smith", 350)\ndigital_book = EBook("Python Programming", "John Smith", 350, "PDF")\n\nprint(physical_book.get_info())\nprint(digital_book.get_info())',
          benefits: []
        },
        {
          id: 'inheritance',
          title: 'Inheritance',
          description: 'Child classes extend parent functionality',
          code: 'class Book:\n    def __init__(self, title, author, pages):\n        self.title = title\n        self.author = author\n        self.pages = pages\n        self.is_checked_out = False\n        \n    def get_info(self):\n        status = "checked out" if self.is_checked_out else "available"\n        return f"{self.title} by {self.author} ({self.pages} pages) - {status}"\n        \n    def check_out(self):\n        self.is_checked_out = True\n        \n    def return_book(self):\n        self.is_checked_out = False\n\n# EBook inherits from Book\nclass EBook(Book):\n    def __init__(self, title, author, pages, format):\n        # Call parent\'s __init__ method\n        super().__init__(title, author, pages)\n        # Add the new attribute\n        self.format = format\n        \n    # Override get_info to include format\n    def get_info(self):\n        # Get base info from parent class\n        base_info = super().get_info()\n        # Return modified string that includes format\n        return base_info.replace(")", f", {self.format})")\n\n# Add a new method specific to EBook\n    def download(self):\n        return f"Downloading {self.title} in {self.format} format..."\n\n# Create and use both types\nphysical_book = Book("Python Programming", "John Smith", 350)\ndigital_book = EBook("Python Programming", "John Smith", 350, "PDF")\n\nprint(physical_book.get_info())\nprint(digital_book.get_info())\nprint(digital_book.download())',
          benefits: ['Code reuse', 'Specialization', '"Is-a" relationship', 'Method overriding']
        },
        {
          id: 'polymorphism',
          title: 'Polymorphism',
          description: 'Treat different derived classes through a common interface',
          code: 'class Book:\n    def __init__(self, title, author, pages):\n        self.title = title\n        self.author = author\n        self.pages = pages\n        self.is_checked_out = False\n        \n    def get_info(self):\n        status = "checked out" if self.is_checked_out else "available"\n        return f"{self.title} by {self.author} ({self.pages} pages) - {status}"\n        \n    def check_out(self):\n        self.is_checked_out = True\n        return f"{self.title} has been checked out."\n\nclass EBook(Book):\n    def __init__(self, title, author, pages, format):\n        super().__init__(title, author, pages)\n        self.format = format\n        \n    def get_info(self):\n        base_info = super().get_info()\n        return base_info.replace(")", f", {self.format})")\n        \n    def check_out(self):\n        self.is_checked_out = True\n        return f"{self.title} ({self.format}) has been downloaded."\n\nclass AudioBook(Book):\n    def __init__(self, title, author, length_mins):\n        super().__init__(title, author, 0)  # No pages for audio books\n        self.length_mins = length_mins\n        \n    def get_info(self):\n        status = "checked out" if self.is_checked_out else "available"\n        return f"{self.title} by {self.author} ({self.length_mins} minutes) - {status}"\n        \n    def check_out(self):\n        self.is_checked_out = True\n        return f"{self.title} audio is ready for streaming."\n\n# Create a collection of different book types\nbooks = [\n    Book("Regular Book", "Author A", 300),\n    EBook("Digital Book", "Author B", 250, "PDF"),\n    AudioBook("Audio Book", "Author C", 480)\n]\n\n# Process all books through the same interface\nprint("\\nBook Information:")\nfor book in books:\n    print(book.get_info())  # Calls the appropriate version for each type\n\nprint("\\nChecking out all books:")\nfor book in books:\n    print(book.check_out())  # Calls the appropriate version for each type',
          benefits: ['Unified interfaces', 'Flexible code', 'Runtime type resolution', 'Extensibility']
        }
      ]
    }
  };

  const stages = conceptProgressions[conceptType]?.stages || [];
  
  const containerAnimations = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const nodeAnimations = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <div className="w-full py-6">
      <h3 className="text-xl font-bold text-center mb-8 text-primary">
        {conceptType === 'functions' && 'Function Evolution: From Basic to Advanced Parameters'}
        {conceptType === 'classes' && 'Class Evolution: From Variables to Object-Oriented Design'}
        {conceptType === 'inheritance' && 'Inheritance Evolution: From Single Classes to Polymorphism'}
      </h3>
      
      <motion.div 
        className="flex flex-col gap-12 items-center"
        variants={containerAnimations}
        initial="hidden"
        animate="visible"
      >
        {/* Path connecting all nodes */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary-light h-5/6 rounded-full opacity-60 -z-10"></div>
        
        {/* Concept progression nodes */}
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            className="relative"
            variants={nodeAnimations}
            whileHover={{ scale: 1.03 }}
            onClick={() => setActiveNode(activeNode === stage.id ? null : stage.id)}
          >
            {/* Node */}
            <div 
              className={`relative p-4 mb-2 border-2 rounded-lg shadow-medium w-[800px] max-w-full transition-all 
                ${activeNode === stage.id 
                  ? 'border-primary bg-bg-accent' 
                  : 'border-border-light bg-bg-secondary hover:border-primary-light cursor-pointer'}`}
            >
              {/* Node header */}
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-primary-dark">{stage.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium rounded-full px-3 py-1 bg-primary text-text-inverse">
                    Stage {index + 1}
                  </span>
                </div>
              </div>
              
              {/* Node description */}
              <p className="text-text-secondary mb-3">{stage.description}</p>
              
              {/* Node content - shown when active */}
              {activeNode === stage.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-4"
                >
                  {/* Code example with syntax highlighting and copy button */}
                  <div className="relative rounded-md overflow-hidden">
                    <div className="flex justify-between items-center bg-bg-primary border-b border-border-light px-4 py-2">
                      <span className="text-xs font-medium text-text-secondary">Python</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCode(stage.code, stage.id);
                        }}
                        className="text-text-secondary hover:text-primary transition-colors p-1 rounded"
                        aria-label="Copy code"
                        title="Copy code"
                      >
                        {copiedCode === stage.id ? (
                          <FiCheck className="w-4 h-4 text-success" />
                        ) : (
                          <FiCopy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      language="python"
                      style={tomorrow}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        borderRadius: '0 0 0.375rem 0.375rem',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {stage.code}
                    </SyntaxHighlighter>
                  </div>
                  
                  {/* Benefits */}
                  {stage.benefits && stage.benefits.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-text-primary mb-2">Key Benefits:</h5>
                      <div className="flex flex-wrap gap-2">
                        {stage.benefits.map((benefit, i) => (
                          <span 
                            key={i} 
                            className="inline-block bg-primary-light text-primary-dark text-sm px-2 py-1 rounded-full"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            
            {/* Connector dot */}
            <div className="absolute left-1/2 -top-6 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-primary bg-bg-primary"></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PythonConceptVisualizer; 