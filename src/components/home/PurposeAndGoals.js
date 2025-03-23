import React from 'react';

const PurposeAndGoals = () => {
  const goals = [
    {
      title: 'Variables and Datatypes',
      description: 'Develop a basic understanding of variables and datatypes in Python, creating a foundation for programming.'
    },
    {
      title: 'Flow Control',
      description: 'Learn how to control program execution with conditional statements, loops, and logical operations.'
    },
    {
      title: 'Functions',
      description: 'Understand how to create, use, and optimize functions to write reusable and modular code.'
    },
    {
      title: 'Classes',
      description: 'Master object-oriented programming concepts through Python classes, methods, and inheritance.'
    }
  ];

  return (
    <section className="py-16 bg-bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Purpose and Goals</h2>
          <p className="text-xl text-text-primary mb-6">
            Preparing Cognitive Science students for machine learning using Python
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {goals.map((goal, index) => (
            <div 
              key={index}
              className="bg-bg-secondary p-6 rounded-lg border border-border-light hover:border-primary transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-text-primary mb-3">{goal.title}</h3>
              <p className="text-text-secondary">{goal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PurposeAndGoals; 