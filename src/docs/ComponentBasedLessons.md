# Component-Based Lesson Creation Guide

This guide explains how to create lessons using our reusable component system. This approach allows for more flexible and maintainable lesson creation compared to using a rigid JSON structure.

## Overview

Our component-based lesson system allows you to:

1. Create lessons by composing individual content components
2. Reuse components across different lessons
3. Create custom compound components for specific teaching patterns
4. Maintain a consistent look and feel while customizing content

## Available Content Components

### Basic Components

- **TextBlock**: For text content with markdown support
  ```jsx
  <TextBlock 
    title="Optional Title" 
    content="Markdown content with **bold** and *italic* text" 
  />
  ```

- **CodeBlock**: For displaying code with syntax highlighting
  ```jsx
  <CodeBlock 
    language="python" 
    content="print('Hello, world!')" 
    caption="Optional caption"
    showLineNumbers={true}
  />
  ```

- **MediaBlock**: For images, videos, and other media
  ```jsx
  <MediaBlock 
    type="image" 
    src="/path/to/image.jpg" 
    alt="Description" 
    caption="Optional caption" 
  />
  ```

- **Exercise**: For practice problems and assignments
  ```jsx
  <Exercise 
    title="Exercise Title" 
    description="What the student needs to do" 
    hints={["Hint 1", "Hint 2"]} 
    solution="Solution code or explanation" 
  />
  ```

- **Quiz**: For knowledge checks and assessments
  ```jsx
  <Quiz 
    title="Quiz Title"
    questions={[
      {
        id: 'q1',
        question: "What is X?",
        options: ["A", "B", "C", "D"],
        correctOption: 1 // Zero-indexed
      }
    ]} 
  />
  ```

### Compound Components

- **ConceptBlock**: Combines a text explanation with a code implementation
  ```jsx
  <ConceptBlock 
    title="Concept Title"
    explanation="Explanation of the concept with markdown support"
    code="Code that implements the concept"
    language="python"
    caption="Optional caption"
  />
  ```

## Lesson Structure Components

### LessonBuilder

The `LessonBuilder` component is the main container for a lesson:

```jsx
<LessonBuilder
  title="Lesson Title"
  description="Lesson description"
  difficulty="Beginner"
  duration="30 minutes"
  prevLesson="previous-lesson-id"
  nextLesson="next-lesson-id"
  onNavigate={handleNavigate}
>
  {/* Lesson content goes here */}
</LessonBuilder>
```

### LessonSection

The `LessonSection` component groups related content:

```jsx
<LessonSection 
  title="Section Title" 
  icon={<SvgIcon />}
  type="lesson" // Can be: warmup, lesson, exercise, postlesson
  isCollapsible={true}
  defaultExpanded={true}
>
  {/* Content components go here */}
</LessonSection>
```

## Two Ways to Build Lessons

### 1. Direct Component Composition (Recommended)

```jsx
export default function MyLesson() {
  return (
    <LessonBuilder title="My Lesson" description="...">
      <LessonSection title="Introduction" type="warmup">
        <TextBlock content="Welcome to the lesson!" />
        <MediaBlock type="image" src="/intro-image.jpg" />
      </LessonSection>
      
      <LessonSection title="Main Content" type="lesson">
        <ConceptBlock 
          title="Important Concept" 
          explanation="..." 
          code="..." 
        />
        <CodeBlock language="python" content="..." />
      </LessonSection>
    </LessonBuilder>
  );
}
```

### 2. JSON-Based Approach (Legacy)

```jsx
const lessonData = {
  title: "My Lesson",
  description: "...",
  content: [
    {
      type: "text",
      title: "Introduction",
      content: "Welcome to the lesson!"
    },
    {
      type: "code",
      language: "python",
      content: "print('Hello')"
    }
  ]
};

// This will be rendered by ModularLessonDetail.js
```

## Creating Custom Components

You can create your own custom components by combining existing components. For example:

```jsx
// src/components/lessons/content/ConceptPairBlock.js
import { TextBlock, CodeBlock } from './';

const ConceptPairBlock = ({ 
  title, 
  goodExample, 
  badExample, 
  explanation 
}) => {
  return (
    <div className="border rounded-lg p-6 mb-6">
      <TextBlock title={title} content={explanation} />
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="border-r pr-4">
          <h4 className="text-green-600 font-medium mb-2">Good Example</h4>
          <CodeBlock content={goodExample} language="python" />
        </div>
        
        <div>
          <h4 className="text-red-600 font-medium mb-2">Bad Example</h4>
          <CodeBlock content={badExample} language="python" />
        </div>
      </div>
    </div>
  );
};

export default ConceptPairBlock;
```

Then add it to the index.js file and LessonModule.js to make it available in both approaches.

## Benefits of the Component-Based Approach

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be used across different lessons
3. **Maintainability**: Easier to update and expand functionality
4. **Flexibility**: Compose lessons in a way that fits your teaching style
5. **Type Safety**: Better IDE autocompletion and error checking
6. **Customization**: Create specialized components for specific teaching patterns

## Example Lessons

See these example pages for reference:
- `/examples/ComponentBasedLesson.js`
- `/examples/ComposableLessonExample.js`
- `/examples/ConceptBlockExample.js` 