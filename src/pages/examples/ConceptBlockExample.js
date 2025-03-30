'use client';

import { 
  LessonBuilder, 
  LessonSection 
} from '@/components/lessons/LessonBuilder';
import {
  TextBlock,
  ConceptBlock
} from '@/components/lessons/content';

export default function ConceptBlockExample() {
  // Icon for lesson sections
  const lessonIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
  
  return (
    <LessonBuilder
      title="Python Data Structures"
      description="Learn about common data structures in Python"
      difficulty="Beginner"
      duration="45 minutes"
    >
      {/* Introduction */}
      <LessonSection 
        title="Introduction" 
        icon={lessonIcon}
        type="lesson"
      >
        <TextBlock
          content="Python comes with several built-in data structures that make it easy to organize and manipulate data. In this lesson, we'll explore the most common ones."
        />
      </LessonSection>
      
      {/* Lists */}
      <LessonSection
        title="Lists"
        icon={lessonIcon}
        type="lesson"
      >
        <ConceptBlock
          title="Python Lists"
          explanation="Lists are ordered collections of items that can be of any type. Lists are mutable, which means you can change their content without changing their identity.
          
Lists are defined by enclosing a comma-separated sequence of objects in square brackets `[]`.

Key characteristics of lists:
* Ordered (items have a defined order)
* Mutable (can be changed after creation)
* Can contain mixed types (integers, strings, objects, even other lists)
* Can contain duplicate elements"
          code={`# Creating a list
fruits = ['apple', 'banana', 'cherry']

# Accessing elements (indexing starts at 0)
first_fruit = fruits[0]  # 'apple'

# Modifying elements
fruits[1] = 'blueberry'  # Changes 'banana' to 'blueberry'

# Adding elements
fruits.append('dragonfruit')  # Adds to the end
fruits.insert(1, 'apricot')   # Inserts at index 1

# Removing elements
fruits.remove('cherry')  # Removes first occurrence
popped_fruit = fruits.pop()  # Removes and returns last item

# Finding length
num_fruits = len(fruits)

# Slicing
subset = fruits[1:3]  # Gets elements at index 1 and 2 (not 3)

# Checking membership
has_apple = 'apple' in fruits  # Returns True or False`}
          language="python"
          caption="Common operations with Python lists"
        />
      </LessonSection>
      
      {/* Dictionaries */}
      <LessonSection
        title="Dictionaries"
        icon={lessonIcon}
        type="lesson"
      >
        <ConceptBlock
          title="Python Dictionaries"
          explanation="Dictionaries are unordered collections of key-value pairs. They are optimized for retrieving data when you know the key.
          
Dictionaries are defined by enclosing a comma-separated list of key-value pairs in curly braces `{}`. Each key-value pair is written as `key: value`.

Key characteristics of dictionaries:
* Keys must be unique and immutable (typically strings, numbers, or tuples)
* Values can be of any type and can be duplicated
* Unordered (in Python < 3.7) or insertion-ordered (in Python >= 3.7)
* Mutable (can be changed after creation)"
          code={`# Creating a dictionary
person = {
    'name': 'Alice',
    'age': 28,
    'is_student': True,
    'courses': ['Python', 'Data Science']
}

# Accessing values using keys
name = person['name']  # 'Alice'

# Alternative access with get() (doesn't raise an error if key doesn't exist)
location = person.get('location', 'Unknown')  # Returns 'Unknown'

# Adding or modifying elements
person['location'] = 'New York'  # Adds new key-value pair
person['age'] = 29  # Updates existing value

# Removing elements
removed_age = person.pop('age')  # Removes key and returns value
del person['is_student']  # Removes key-value pair

# Getting all keys, values, or items
all_keys = list(person.keys())
all_values = list(person.values())
all_items = list(person.items())  # List of (key, value) tuples

# Checking if a key exists
has_name = 'name' in person  # Returns True`}
          language="python"
          caption="Common operations with Python dictionaries"
        />
      </LessonSection>
      
      {/* Sets */}
      <LessonSection
        title="Sets"
        icon={lessonIcon}
        type="lesson"
      >
        <ConceptBlock
          title="Python Sets"
          explanation="Sets are unordered collections of unique elements. They are useful for membership testing and eliminating duplicate entries.
          
Sets are defined by enclosing a comma-separated list of elements in curly braces `{}` or by using the `set()` constructor.

Key characteristics of sets:
* Unordered (elements have no defined order)
* All elements must be unique
* Elements must be immutable (can't contain lists or dictionaries)
* Mutable (the set itself can be modified)"
          code={`# Creating a set
colors = {'red', 'green', 'blue', 'red'}  # Duplicate 'red' will be removed
print(colors)  # {'red', 'green', 'blue'}

# Creating a set from a list (eliminates duplicates)
numbers = set([1, 2, 2, 3, 4, 4, 5])
print(numbers)  # {1, 2, 3, 4, 5}

# Adding elements
colors.add('yellow')

# Removing elements
colors.remove('green')  # Raises an error if not found
colors.discard('purple')  # No error if not found

# Set operations
set_a = {1, 2, 3, 4}
set_b = {3, 4, 5, 6}

# Union (all elements from both sets)
union_set = set_a | set_b  # {1, 2, 3, 4, 5, 6}

# Intersection (elements in both sets)
intersection_set = set_a & set_b  # {3, 4}

# Difference (elements in first set but not in second)
difference_set = set_a - set_b  # {1, 2}

# Symmetric difference (elements in either set, but not both)
symmetric_difference = set_a ^ set_b  # {1, 2, 5, 6}`}
          language="python"
          caption="Common operations with Python sets"
        />
      </LessonSection>
    </LessonBuilder>
  );
} 