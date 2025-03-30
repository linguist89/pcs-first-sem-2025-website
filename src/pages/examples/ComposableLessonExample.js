'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LessonBuilder, 
  LessonSection 
} from '@/components/lessons/LessonBuilder';
import {
  TextBlock,
  CodeBlock,
  Exercise,
  MediaBlock,
  Quiz
} from '@/components/lessons/content';

export default function ComposableLessonExample() {
  const router = useRouter();
  
  // Example navigation handler
  const handleNavigate = (lessonId) => {
    router.push(`/lessons/${lessonId}`);
  };
  
  // Icons for section types
  const sectionIcons = {
    warmup: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    lesson: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    exercise: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  };
  
  return (
    <LessonBuilder
      title="Composable Lesson Example"
      description="A demonstration of composing lessons with individual components"
      difficulty="Intermediate"
      duration="30 minutes"
      prevLesson="previous-lesson-id"
      nextLesson="next-lesson-id"
      onNavigate={handleNavigate}
    >
      {/* Warm-up Section */}
      <LessonSection 
        title="Getting Started" 
        icon={sectionIcons.warmup}
        type="warmup"
      >
        <TextBlock
          title="Prerequisites"
          content="Before starting this lesson, you should have a basic understanding of JavaScript and React."
        />
        
        <TextBlock
          content="This lesson will show you how to create composable components for building interactive lessons."
        />
      </LessonSection>
      
      {/* Main Lesson Section */}
      <LessonSection
        title="Component Composition"
        icon={sectionIcons.lesson}
        type="lesson"
      >
        <TextBlock
          title="Why Use Component Composition?"
          content="Component composition allows for more flexible and maintainable code. Instead of large monolithic components, we can create smaller, reusable pieces that can be combined in different ways."
        />
        
        <CodeBlock
          language="jsx"
          content={`// Example of component composition
import { TextBlock, CodeBlock } from '@/components/lessons/content';

function MyLesson() {
  return (
    <div>
      <TextBlock 
        title="Introduction" 
        content="This is an introduction to the topic." 
      />
      <CodeBlock 
        language="javascript"
        content="console.log('Hello, world!');" 
      />
    </div>
  );
}`}
          caption="A simple example of component composition in React"
        />
        
        <MediaBlock
          type="image"
          src="https://via.placeholder.com/800x400"
          alt="Component Composition Diagram"
          caption="Visualization of component composition pattern"
        />
      </LessonSection>
      
      {/* Exercise Section */}
      <LessonSection
        title="Practice Exercise"
        icon={sectionIcons.exercise}
        type="exercise"
      >
        <Exercise
          title="Create a Composable Component"
          description="Create a new component that combines a TextBlock and CodeBlock component to display a concept and its implementation."
          hints={[
            "Use the existing TextBlock and CodeBlock components",
            "Pass the appropriate props to each component",
            "Think about what props your new component should accept"
          ]}
          solution={`import { TextBlock, CodeBlock } from '@/components/lessons/content';

const ConceptBlock = ({ title, explanation, code, language }) => {
  return (
    <div className="border rounded-lg p-4 mb-6">
      <TextBlock title={title} content={explanation} />
      <CodeBlock language={language} content={code} />
    </div>
  );
};

export default ConceptBlock;`}
        />
      </LessonSection>
      
      {/* Quiz Section */}
      <LessonSection
        title="Knowledge Check"
        icon={sectionIcons.lesson}
        type="postlesson"
      >
        <Quiz
          title="Component Composition Quiz"
          questions={[
            {
              id: 'q1',
              question: "What is the main benefit of component composition?",
              options: [
                "It makes the code run faster",
                "It allows for more reusable and maintainable code",
                "It reduces the need for styling",
                "It automatically handles state management"
              ],
              correctOption: 1
            },
            {
              id: 'q2',
              question: "Which of the following is NOT a best practice for component composition?",
              options: [
                "Creating small, focused components",
                "Passing props to customize component behavior",
                "Creating a single component that handles all functionality",
                "Composing complex UIs from simple components"
              ],
              correctOption: 2
            }
          ]}
        />
      </LessonSection>
    </LessonBuilder>
  );
} 