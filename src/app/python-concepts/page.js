'use client';

import React from 'react';
import { PythonConceptVisualizerDemo } from '@/components/lessons/content';

// Code example component with syntax highlighting
const CodeExample = ({ code, language = 'python' }) => {
  return (
    <div className="bg-bg-primary p-4 rounded-md my-4 overflow-x-auto">
      <pre className="text-sm">
        <code className="font-mono text-text-primary whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
};

export default function PythonConceptsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4 text-primary">Python Concept Visualizations</h1>
        <p className="text-lg text-text-secondary max-w-3xl mx-auto">
          Interactive visualizations to help understand the progressive evolution of key Python programming concepts
        </p>
      </header>
      
      <section className="mb-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-primary-dark">Introduction</h2>
        <p className="mb-4 text-text-secondary">
          Understanding how code evolves from simple to more sophisticated patterns is key to becoming a proficient programmer. 
          This resource provides visual representations of this evolution for three core Python concepts: functions, classes, and inheritance.
        </p>
        <p className="mb-4 text-text-secondary">
          The visualizations below demonstrate the progression of Python concepts from basic implementations to more advanced forms. 
          Click on any node to see detailed examples and benefits of each approach.
        </p>
      </section>
      
      <section className="mb-16">
        <PythonConceptVisualizerDemo />
      </section>
      
      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary-dark">Understanding *args</h2>
          <p className="mb-4 text-text-secondary">
            The <code className="bg-bg-secondary px-1 rounded">*args</code> syntax in Python allows a function to accept any number of positional arguments. 
            Python will pack these arguments into a tuple that you can then process in your function body. This is particularly useful when 
            you don't know in advance how many arguments your function will receive.
          </p>
          <CodeExample 
            code={`def sum_all(*args):
    """Sum all numbers passed to the function"""
    total = 0
    for num in args:  # args is a tuple
        total += num
    return total

# Call with any number of arguments
print(sum_all(1, 2))           # 3
print(sum_all(1, 2, 3, 4, 5))  # 15
print(sum_all())               # 0`} 
          />
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary-dark">Understanding **kwargs</h2>
          <p className="mb-4 text-text-secondary">
            The <code className="bg-bg-secondary px-1 rounded">**kwargs</code> syntax allows a function to accept any number of keyword arguments. 
            Python packs these into a dictionary where the keys are the argument names and the values are the argument values. 
            This is extremely useful when you want to provide optional named parameters.
          </p>
          <CodeExample 
            code={`def build_profile(**kwargs):
    """Build a user profile with any number of attributes"""
    profile = {}
    for key, value in kwargs.items():
        profile[key] = value
    return profile

# Call with different keyword arguments
user1 = build_profile(name="Alice", age=30, occupation="Engineer")
user2 = build_profile(name="Bob", is_student=True, hobbies=["coding", "hiking"])

print(user1)
print(user2)`} 
          />
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary-dark">Classes: Bundling Data and Behavior</h2>
          <p className="mb-4 text-text-secondary">
            Classes in Python provide a way to bundle data (attributes) and functionality (methods) together. 
            This is a core principle of object-oriented programming and leads to more maintainable and intuitive code.
          </p>
          <CodeExample 
            code={`class Student:
    def __init__(self, name, grade, student_id):
        self.name = name
        self.grade = grade
        self.student_id = student_id
        self.courses = []
    
    def add_course(self, course):
        self.courses.append(course)
    
    def get_course_count(self):
        return len(self.courses)
    
    def is_passing(self):
        return self.grade >= 60

# Create a student object
alice = Student("Alice Smith", 85, "A12345")
alice.add_course("Python Programming")
alice.add_course("Data Science")

print(f"{alice.name} is taking {alice.get_course_count()} courses")
print(f"Passing status: {alice.is_passing()}")`} 
          />
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary-dark">Inheritance and Polymorphism in Action</h2>
          <p className="mb-4 text-text-secondary">
            Inheritance lets us create a new class that inherits attributes and methods from an existing class. 
            Polymorphism allows us to use objects of derived classes through their common base class interface.
          </p>
          <CodeExample 
            code={`class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        raise NotImplementedError("Subclasses must implement this method")

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

# Create a list of different animals
animals = [
    Dog("Buddy"),
    Cat("Whiskers"),
    Dog("Rex")
]

# Polymorphism in action - same interface, different implementations
for animal in animals:
    print(animal.speak())`} 
          />
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary-dark">Conclusion</h2>
          <p className="mb-4 text-text-secondary">
            Understanding the evolution of programming concepts helps you make better decisions about code organization and design. 
            As your programs grow in complexity, leveraging functions with flexible parameters, classes with proper encapsulation, 
            and inheritance hierarchies will lead to more maintainable and robust code.
          </p>
          <div className="bg-bg-accent p-6 rounded-lg border border-primary-light">
            <h3 className="text-lg font-semibold mb-2 text-primary">Further Practice</h3>
            <p className="text-text-secondary">
              Try converting some of your existing code that uses separate variables to use classes instead. 
              Identify places where inheritance might help you reduce code duplication and make your code more flexible.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
} 