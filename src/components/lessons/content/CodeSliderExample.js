'use client';

import React from 'react';
import CodeSlider from './CodeSlider';

const CodeSliderExample = () => {
  // Example data for a messy code -> functions -> classes progression
  const slides = [
    {
      code: `# Messy code with repetition
name1 = "Alice"
age1 = 25
print(f"Hello, my name is {name1} and I am {age1} years old")

# Duplicate code for a second person
name2 = "Bob"
age2 = 30
print(f"Hello, my name is {name2} and I am {age2} years old")

# Duplicate code for a third person
name3 = "Charlie"
age3 = 35
print(f"Hello, my name is {name3} and I am {age3} years old")`,
      explanation: "Notice how the same pattern is repeated multiple times with only the values changing. This approach is prone to errors and difficult to maintain.",
      blockExplanations: [
        "The first block shows the problem: we have repetitive code. Each person requires the same pattern of variable declarations and output statements.",
        "We're duplicating the exact same code structure again, just with different values. If we wanted to change how the greeting works, we'd need to update all three instances.",
        "A third repetition of the same code pattern. This is a clear sign that we should refactor to make our code more maintainable."
      ]
    },
    {
      code: `# Using a function to reduce repetition
def introduce(name, age):
    print(f"Hello, my name is {name} and I am {age} years old")

# Now we can call the function for each person
introduce("Alice", 25)
introduce("Bob", 30)
introduce("Charlie", 35)`,
      explanation: "The function solution eliminates repetition by defining the behavior once and reusing it with different parameters.",
      blockExplanations: [
        "We've created a function called `introduce` that takes two parameters: `name` and `age`. This encapsulates the behavior in one place.",
        "Now we can simply call the function with different arguments. The code is much cleaner and easier to maintain. If we need to change the message, we only need to update it in one place."
      ]
    },
    {
      code: `# Using a class to represent a Person
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        print(f"Hello, my name is {self.name} and I am {self.age} years old")

# Create instances of the Person class
alice = Person("Alice", 25)
bob = Person("Bob", 30)
charlie = Person("Charlie", 35)

# Call the method on each instance
alice.introduce()
bob.introduce()
charlie.introduce()`,
      explanation: "Object-oriented programming allows us to create a model of a Person with both data (properties) and behavior (methods).",
      blockExplanations: [
        "We're now using a class to model a `Person`. A class is like a blueprint for creating objects with both data and behavior.",
        "The `__init__` method is a special constructor that sets up the initial state of each Person object. The `self` parameter refers to the instance being created.",
        "The `introduce` method is a function that belongs to the Person class. It can access the object's properties using `self`.",
        "We create instances (objects) of the Person class by calling the class like a function. Each instance stores its own name and age.",
        "Now we can call the `introduce` method on each instance. Notice how the method doesn't need any parameters - it already has access to the object's properties."
      ]
    },
    {
      code: `# Advanced: Adding more functionality to the class
class Person:
    def __init__(self, name, age, job=None):
        self.name = name
        self.age = age
        self.job = job
    
    def introduce(self):
        intro = f"Hello, my name is {self.name} and I am {self.age} years old"
        if self.job:
            intro += f". I work as a {self.job}"
        print(intro)
    
    def have_birthday(self):
        self.age += 1
        print(f"Happy Birthday! {self.name} is now {self.age}")

# Create instances with more data
alice = Person("Alice", 25, "Developer")
bob = Person("Bob", 30, "Designer")
charlie = Person("Charlie", 35)

# Use the methods
alice.introduce()
bob.introduce()
charlie.introduce()

# Demonstrate changing state
alice.have_birthday()
alice.introduce()`,
      explanation: "Classes can maintain state that changes over time, with methods that both access and modify that state.",
      blockExplanations: [
        "We've enhanced our Person class with more functionality. Notice the `job` parameter has a default value of `None`, making it optional.",
        "The constructor now stores an additional `job` property that can be used by other methods.",
        "The `introduce` method has been updated to conditionally include job information if it exists.",
        "We've added a new `have_birthday` method that modifies the object's state by incrementing the age property.",
        "When creating instances, we can now specify a job for some people and omit it for others.",
        "The `introduce` method adapts to the presence or absence of job information.",
        "The `have_birthday` method demonstrates that objects maintain state - when Alice has a birthday, her age increases permanently, affecting future method calls."
      ]
    }
  ];

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Code Evolution: From Messy Code to Classes</h2>
      <p className="mb-4">
        This example demonstrates how code can evolve from repetitive, messy code to well-structured 
        object-oriented programming using classes. Step through each block to see the progression.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-blue-800 mb-2">Block-Focused Learning Journey</h3>
        <p className="text-blue-700">
          This component guides you through each code block with focused attention:
        </p>
        <ul className="text-blue-700 mt-2 list-disc pl-5 space-y-1">
          <li>
            <strong>Block-by-Block Exploration</strong>: Each comment-prefixed code block is highlighted while others are blurred
          </li>
          <li>
            <strong>Targeted Explanations</strong>: Specific explanations for each code block provide deeper understanding
          </li>
          <li>
            <strong>Sequential Navigation</strong>: Step through blocks sequentially before moving to the next concept
          </li>
          <li>
            <strong>Progressive Learning</strong>: See how code evolves from simple patterns to complex structures
          </li>
        </ul>
      </div>
      
      <CodeSlider 
        slides={slides}
        language="python"
        title="Code Evolution Example"
      />
      
      <div className="mt-6 text-sm text-gray-600">
        <p>Use the Previous/Next buttons to navigate between code blocks. When you reach the end of a code example, you'll automatically move to the next concept.</p>
      </div>
    </div>
  );
};

export default CodeSliderExample; 