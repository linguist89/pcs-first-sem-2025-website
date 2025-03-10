import React from 'react';

const PurposeAndGoals = () => {
  const goals = [
    {
      title: 'Python Fundamentals',
      description: 'Build a solid foundation in Python programming with a focus on concepts relevant to cognitive science research.'
    },
    {
      title: 'Data Analysis Skills',
      description: 'Learn to process, analyze, and visualize complex datasets using libraries like Pandas, NumPy, and Matplotlib.'
    },
    {
      title: 'Machine Learning Applications',
      description: 'Apply machine learning techniques to cognitive science problems using scikit-learn and TensorFlow/PyTorch.'
    },
    {
      title: 'Research Preparation',
      description: 'Develop the technical skills needed to conduct computational research in cognitive science.'
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
          <p className="text-lg text-text-secondary mb-8">
            This course bridges the gap between cognitive science theory and computational methods,
            equipping students with the programming skills needed to apply machine learning techniques
            to cognitive science research questions.
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

        <div className="mt-12 text-center">
          <p className="text-text-secondary italic">
            "Our mission is to empower cognitive science students with the computational tools 
            needed to explore the fascinating intersection of human cognition and artificial intelligence."
          </p>
        </div>
      </div>
    </section>
  );
};

export default PurposeAndGoals; 