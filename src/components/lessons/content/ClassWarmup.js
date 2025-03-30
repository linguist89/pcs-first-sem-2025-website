'use client';

import React from 'react';
import CodeSlider from './CodeSlider';

const ClassWarmup = () => {
  // Define the slides for the code progression from messy code to classes
  const slides = [
    {
      code: `# First book information
title1 = "The Great Gatsby"
author1 = "F. Scott Fitzgerald"
pages1 = 180
genre1 = "Fiction"
is_checked_out1 = False

# Calculate if it's a long read
is_long_read1 = pages1 > 300

# Create a string with book information
status1 = "checked out" if is_checked_out1 else "available"
info1 = f"\"{title1}\" by {author1} ({genre1}, {pages1} pages) - {status1}"

print(info1)
print(f"Is {title1} a long read? {is_long_read1}")

# Second book with almost identical code
title2 = "War and Peace"
author2 = "Leo Tolstoy"
pages2 = 1225
genre2 = "Historical Fiction"
is_checked_out2 = False

# Check it out
is_checked_out2 = True

# Calculate if it's a long read (duplicated logic)
is_long_read2 = pages2 > 300

# Create a string with book information (duplicated logic)
status2 = "checked out" if is_checked_out2 else "available"
info2 = f"\"{title2}\" by {author2} ({genre2}, {pages2} pages) - {status2}"

print(f"{title2} is checked out: {is_checked_out2}")

# Return the book
is_checked_out2 = False
print(f"{title2} is checked out: {is_checked_out2}")

# Third book with more duplication
title3 = "Python Crash Course"
author3 = "Eric Matthes"
pages3 = 544
genre3 = "Programming"
is_checked_out3 = False

# Calculate if it's a long read (duplicated logic again)
is_long_read3 = pages3 > 300

print(f"Is {title3} a long read? {is_long_read3}")`,
      explanation: "When first exploring a problem, our code is often messy as we're figuring things out. We might write separate code blocks for each book we're analyzing.",
      blockExplanations: [
        "Here we define variables for our first book. Each piece of information gets its own variable, with a number suffix to distinguish it from other books.",
        "We calculate a derived property - whether the book is considered a 'long read' based on page count.",
        "We format the book information into a readable string and print it.",
        "We repeat the same pattern for a second book, creating a whole new set of variables with '2' suffixes.",
        "We're modifying the state of the second book (checking it out), but since our data is scattered across variables, we have to manually update the relevant variables.",
        "We repeat the same logic calculation for the second book.",
        "We repeat the same string formatting logic for the second book.",
        "We change the state again (returning the book).",
        "And here we go again with a third book, creating yet more variables with '3' suffixes.",
        "By this point, the repetitive nature of the code becomes very clear - we're duplicating the same logic for each book."
      ]
    },
    {
      code: `# Define functions to avoid code duplication
def is_long_read(pages):
    """Return True if the book has more than 300 pages."""
    return pages > 300

def format_book_info(title, author, genre, pages, is_checked_out):
    """Create a formatted string with book information."""
    status = "checked out" if is_checked_out else "available"
    return f"\"{title}\" by {author} ({genre}, {pages} pages) - {status}"

def check_out_book(is_checked_out):
    """Check out a book."""
    return True

def return_book(is_checked_out):
    """Return a book."""
    return False

# Using our functions with the first book
title1 = "The Great Gatsby"
author1 = "F. Scott Fitzgerald"
pages1 = 180
genre1 = "Fiction"
is_checked_out1 = False

print(format_book_info(title1, author1, genre1, pages1, is_checked_out1))
print(f"Is {title1} a long read? {is_long_read(pages1)}")

# Using our functions with the second book
title2 = "War and Peace"
author2 = "Leo Tolstoy"
pages2 = 1225
genre2 = "Historical Fiction"
is_checked_out2 = False

is_checked_out2 = check_out_book(is_checked_out2)
print(f"{title2} is checked out: {is_checked_out2}")

is_checked_out2 = return_book(is_checked_out2)
print(f"{title2} is checked out: {is_checked_out2}")

# Using our functions with the third book
title3 = "Python Crash Course"
author3 = "Eric Matthes"
pages3 = 544
genre3 = "Programming"
is_checked_out3 = False

print(f"Is {title3} a long read? {is_long_read(pages3)}")`,
      explanation: "As we notice repeating patterns, we create functions to avoid code duplication and improve readability.",
      blockExplanations: [
        "Here we've refactored the repetitive logic into a dedicated function. This `is_long_read` function takes `pages` as a parameter and returns whether it's a long read.",
        "Similarly, we've created a function to format the book information string. Note how the function takes individual pieces of book data as parameters.",
        "We've also created functions for checking out and returning books. These functions encapsulate the state changes.",
        "We still have separate variables for each book, but now we're using consistent functions to work with the data.",
        "We use our `format_book_info` function to generate the book information string, passing in all the individual pieces of data.",
        "And we use our `is_long_read` function to check if the book is a long read. Notice how we're reusing the same function for different books.",
        "For the second book, we use our `check_out_book` function to handle the state change. However, we still need to manually store the result back to the variable.",
        "Similarly, we use `return_book` to handle returning the book, again manually updating the variable.",
        "We're still repeating the variable creation for each book, but the logic has been consolidated into functions."
      ]
    },
    {
      code: `# Using dictionaries to group related data
def is_long_read(book):
    """Return True if the book has more than 300 pages."""
    return book['pages'] > 300

def format_book_info(book):
    """Create a formatted string with book information."""
    status = "checked out" if book['is_checked_out'] else "available"
    return f"\"{book['title']}\" by {book['author']} ({book['genre']}, {book['pages']} pages) - {status}"

def check_out_book(book):
    """Check out a book."""
    book['is_checked_out'] = True
    return book

def return_book(book):
    """Return a book."""
    book['is_checked_out'] = False
    return book

# Create book dictionaries
book1 = {
    'title': "The Great Gatsby",
    'author': "F. Scott Fitzgerald",
    'pages': 180,
    'genre': "Fiction",
    'is_checked_out': False
}

book2 = {
    'title': "War and Peace",
    'author': "Leo Tolstoy",
    'pages': 1225,
    'genre': "Historical Fiction",
    'is_checked_out': False
}

book3 = {
    'title': "Python Crash Course",
    'author': "Eric Matthes",
    'pages': 544,
    'genre': "Programming",
    'is_checked_out': False
}

# Using our functions with the dictionaries
print(format_book_info(book1))
print(f"Is {book1['title']} a long read? {is_long_read(book1)}")

check_out_book(book2)
print(f"{book2['title']} is checked out: {book2['is_checked_out']}")
return_book(book2)
print(f"{book2['title']} is checked out: {book2['is_checked_out']}")

print(f"Is {book3['title']} a long read? {is_long_read(book3)}")`,
      explanation: "We can further improve our code by bundling related data together in dictionaries.",
      blockExplanations: [
        "We've updated our functions to work with dictionaries rather than individual parameters. Now `is_long_read` takes a book dictionary rather than just the pages value.",
        "The `format_book_info` function now extracts all the needed information from the book dictionary.",
        "The `check_out_book` function now directly modifies the book's state by setting the 'is_checked_out' property.",
        "Similarly, `return_book` directly modifies the dictionary.",
        "Here we create a dictionary for our first book, bundling all related data together. This groups the data in a more logical way compared to separate variables.",
        "We do the same for the second and third books.",
        "When calling functions, we now pass the entire book dictionary rather than separate variables. This makes the code more concise and readable.",
        "Since the functions now directly modify the dictionaries, we no longer need to manually store the return values. We just call `check_out_book(book2)` and it updates the dictionary.",
        "The same applies to `return_book` - it directly modifies the dictionary, making the code cleaner."
      ]
    },
    {
      code: `# Creating a Book class to bundle data and behavior
class Book:
    def __init__(self, title, author, pages, genre):
        self.title = title
        self.author = author
        self.pages = pages
        self.genre = genre
        self.is_checked_out = False
    
    def check_out(self):
        self.is_checked_out = True
    
    def return_book(self):
        self.is_checked_out = False
    
    def is_long_read(self):
        return self.pages > 300
    
    def get_info(self):
        status = "checked out" if self.is_checked_out else "available"
        return f"\"{self.title}\" by {self.author} ({self.genre}, {self.pages} pages) - {status}"

# Create some book objects
book1 = Book("The Great Gatsby", "F. Scott Fitzgerald", 180, "Fiction")
book2 = Book("War and Peace", "Leo Tolstoy", 1225, "Historical Fiction")
book3 = Book("Python Crash Course", "Eric Matthes", 544, "Programming")

# Test the methods
print(book1.get_info())
print(f"Is {book1.title} a long read? {book1.is_long_read()}")

book2.check_out()
print(f"{book2.title} is checked out: {book2.is_checked_out}")
book2.return_book()
print(f"{book2.title} is checked out: {book2.is_checked_out}")

print(f"Is {book3.title} a long read? {book3.is_long_read()}")`,
      explanation: "Using a class to bundle both the data (attributes) and the functions (methods) together creates a more intuitive, cohesive representation of a book.",
      blockExplanations: [
        "We define a `Book` class to serve as a blueprint for creating book objects. The class encapsulates both data (attributes) and behavior (methods).",
        "The `__init__` method is a special constructor method that initializes a new book object. It sets up the initial state of the book with the provided parameters and sets `is_checked_out` to a default value of `False`.",
        "The `check_out` method modifies the book's state by setting `is_checked_out` to `True`. Notice how this method doesn't need any parameters (besides `self`) because it already has access to the book's data.",
        "The `return_book` method sets `is_checked_out` back to `False`.",
        "The `is_long_read` method checks if the book has more than 300 pages, just like our previous functions, but now it's part of the book object itself.",
        "The `get_info` method generates a string representation of the book, again using the book's own data.",
        "We create book objects by calling the `Book` class with the required parameters. This creates instances of the `Book` class, each with its own data.",
        "To use a method, we call it on the specific book object using dot notation. This makes the code very readable - it's clear that we're getting information about `book1`.",
        "The methods are now part of the objects themselves, so instead of `check_out_book(book2)`, we can write `book2.check_out()`, which is more intuitive.",
        "Similarly, `book2.return_book()` is a more natural way to express returning a book.",
        "Note how we can access attributes like `book2.is_checked_out` directly to see the book's state."
      ]
    }
  ];

  return (
    <div className="my-8">
      <h3 className="text-xl font-bold mb-4">The Evolution of Code Organization: Library Book Tracking</h3>
      <p className="mb-4">
        Before diving into classes for our student data, let's understand the progression from messy exploratory code to 
        well-organized classes using a simple library book example.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-blue-800 mb-2">Step-by-Step Code Evolution</h4>
        <p className="text-blue-700">
          Below is a guided walkthrough of how code can evolve from initial exploration to well-structured classes:
        </p>
        <ul className="text-blue-700 mt-2 list-disc pl-5 space-y-1">
          <li>Navigate through each stage using the arrows or dots</li>
          <li>Each stage shows a different approach to the same problem</li>
          <li>The floating box explains the key concepts of each approach</li>
          <li>Within each stage, you can click through highlighted code blocks</li>
        </ul>
      </div>
      
      <CodeSlider 
        slides={slides}
        language="python"
        title="Library Book Tracking: From Messy Code to Classes"
        showLineNumbers={true}
      />
      
      <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-md">
        <h4 className="font-semibold text-green-800 mb-2">Benefits of the Class Approach</h4>
        <p className="text-green-700 mb-2">
          Notice how the class approach offers many advantages:
        </p>
        <ol className="list-decimal pl-5 text-green-700 space-y-1">
          <li><strong>Code Organization</strong>: Related data and behavior are bundled together in a single unit</li>
          <li><strong>Code Reuse</strong>: Each book object automatically has all the methods defined in the class</li>
          <li><strong>State Management</strong>: Methods can modify the object's state (like <code>check_out()</code> changing <code>is_checked_out</code>)</li>
          <li><strong>Readability</strong>: Code using classes is often more intuitive and mirrors how we think about real-world objects</li>
          <li><strong>Maintainability</strong>: Changes to book behavior only need to be made in one place (the class definition)</li>
        </ol>
      </div>
    </div>
  );
};

export default ClassWarmup; 