'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TextBlock,
  CodeBlock,
  Exercise,
  MediaBlock,
  Quiz
} from '@/components/lessons/content';

// Example lesson data
const lessonData = {
  title: "Introduction to Python",
  description: "Learn the basics of Python programming language",
  difficulty: "Beginner",
  duration: "45 minutes",
  sections: [
    {
      title: "Welcome",
      type: "warmup",
      content: [
        {
          type: "text",
          title: "Getting Started",
          content: "In this lesson, we'll learn the fundamentals of Python programming. Python is a high-level, interpreted programming language known for its readability and simplicity."
        },
        {
          type: "text",
          content: "Before we begin, make sure you have Python installed on your computer. You can download it from [python.org](https://python.org)."
        }
      ]
    },
    {
      title: "Basic Syntax",
      type: "lesson",
      content: [
        {
          type: "text",
          title: "Python Syntax",
          content: "Python uses indentation to define code blocks. This makes Python code very readable compared to other languages."
        },
        {
          type: "code",
          language: "python",
          content: "# This is a comment\nprint('Hello, World!')\n\nif True:\n    print('Indentation is important in Python')",
          caption: "Basic Python syntax example"
        },
        {
          type: "media",
          mediaType: "image",
          src: "/images/python-logo.png",
          alt: "Python Logo",
          caption: "The Python programming language logo"
        }
      ]
    },
    {
      title: "Practice",
      type: "exercise",
      content: [
        {
          type: "exercise",
          title: "Your First Python Program",
          description: "Write a program that asks for the user's name and prints a greeting.",
          hints: [
            "Use the input() function to get user input",
            "Concatenate strings with the + operator"
          ],
          solution: "name = input('What is your name? ')\nprint('Hello, ' + name + '!')"
        }
      ]
    }
  ]
};

export default function ComponentBasedLesson() {
  const [activeSection, setActiveSection] = useState(0);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Lesson Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{lessonData.title}</h1>
        <p className="text-gray-600 mt-2">{lessonData.description}</p>
        
        <div className="flex gap-2 mt-4">
          {lessonData.difficulty && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {lessonData.difficulty}
            </span>
          )}
          {lessonData.duration && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {lessonData.duration}
            </span>
          )}
        </div>
      </div>
      
      {/* Section Tabs */}
      <div className="flex border-b mb-8">
        {lessonData.sections.map((section, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-medium ${
              activeSection === index
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveSection(index)}
          >
            {section.title}
          </button>
        ))}
      </div>
      
      {/* Section Content */}
      <div className="space-y-8">
        {lessonData.sections[activeSection].content.map((contentItem, index) => {
          switch (contentItem.type) {
            case 'text':
              return (
                <TextBlock
                  key={index}
                  title={contentItem.title}
                  content={contentItem.content}
                />
              );
            case 'code':
              return (
                <CodeBlock
                  key={index}
                  language={contentItem.language}
                  content={contentItem.content}
                  caption={contentItem.caption}
                />
              );
            case 'media':
              return (
                <MediaBlock
                  key={index}
                  type={contentItem.mediaType}
                  src={contentItem.src}
                  alt={contentItem.alt}
                  caption={contentItem.caption}
                />
              );
            case 'exercise':
              return (
                <Exercise
                  key={index}
                  title={contentItem.title}
                  description={contentItem.description}
                  hints={contentItem.hints}
                  solution={contentItem.solution}
                />
              );
            default:
              return (
                <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-700">
                    Unknown content type: {contentItem.type}
                  </p>
                </div>
              );
          }
        })}
      </div>
    </div>
  );
} 