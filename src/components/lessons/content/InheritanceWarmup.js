'use client';

import React from 'react';
import CodeSlider from './CodeSlider';

const InheritanceWarmup = () => {
  // Define the slides for the code progression from basic classes to inheritance and polymorphism
  const slides = [
    {
      code: `# Basic Book class
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
        return f"'{self.title}' by {self.author} ({self.genre}, {self.pages} pages) - {status}"

# Create some book objects
book1 = Book("The Great Gatsby", "F. Scott Fitzgerald", 180, "Fiction")
book2 = Book("War and Peace", "Leo Tolstoy", 1225, "Historical Fiction")

# Test the methods
print(book1.get_info())
print(f"Is {book1.title} a long read? {book1.is_long_read()}")

book2.check_out()
print(f"{book2.title} is checked out: {book2.is_checked_out}")`,
      explanation: "We start with a basic Book class that handles common book operations like checking out, returning, and determining if it's a long read.",
      blockExplanations: [
        "The `Book` class has attributes for title, author, pages, genre, and checkout status.",
        "It includes methods for checking out and returning books.",
        "The `is_long_read` method determines if a book has more than 300 pages.",
        "The `get_info` method provides a formatted string with book information.",
        "We create instances of the Book class and test its methods."
      ]
    },
    {
      code: `# Adding a DigitalBook class without inheritance
class DigitalBook:
    def __init__(self, title, author, pages, genre, file_format):
        self.title = title
        self.author = author
        self.pages = pages
        self.genre = genre
        self.file_format = file_format
        self.is_checked_out = False
    
    def check_out(self):
        self.is_checked_out = True
    
    def return_book(self):
        self.is_checked_out = False
    
    def is_long_read(self):
        return self.pages > 300
    
    def get_info(self):
        status = "checked out" if self.is_checked_out else "available"
        return f"'{self.title}' by {self.author} ({self.genre}, {self.pages} pages, {self.file_format}) - {status}"

# Create a digital book
ebook = DigitalBook("Python Crash Course", "Eric Matthes", 544, "Programming", "PDF")

# Test the methods
print(ebook.get_info())
print(f"Is {ebook.title} a long read? {ebook.is_long_read()}")

ebook.check_out()
print(f"{ebook.title} is checked out: {ebook.is_checked_out}")`,
      explanation: "Now we need to handle digital books, which have all the same properties as regular books plus a file format. Without inheritance, we'd need to duplicate most of the Book class code.",
      blockExplanations: [
        "The `DigitalBook` class has almost identical code to the `Book` class.",
        "The only differences are the addition of the `file_format` attribute and including it in the `get_info` method.",
        "This approach leads to code duplication, which violates the DRY (Don't Repeat Yourself) principle.",
        "If we need to change how books work (like modifying the `check_out` method), we'd have to update it in both classes.",
        "This approach doesn't express the relationship that a digital book is a type of book."
      ]
    },
    {
      code: `# Using inheritance to create a DigitalBook class
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
        return f"'{self.title}' by {self.author} ({self.genre}, {self.pages} pages) - {status}"

class DigitalBook(Book):  # DigitalBook inherits from Book
    def __init__(self, title, author, pages, genre, file_format):
        # Call the parent class's __init__ method
        super().__init__(title, author, pages, genre)
        # Add the new attribute specific to DigitalBook
        self.file_format = file_format
    
    # Override the get_info method to include file format
    def get_info(self):
        status = "checked out" if self.is_checked_out else "available"
        return f"'{self.title}' by {self.author} ({self.genre}, {self.pages} pages, {self.file_format}) - {status}"

# Create both types of books
book = Book("The Great Gatsby", "F. Scott Fitzgerald", 180, "Fiction")
ebook = DigitalBook("Python Crash Course", "Eric Matthes", 544, "Programming", "PDF")

# Test the methods
print(book.get_info())
print(ebook.get_info())  # Uses the overridden method
print(f"Is {book.title} a long read? {book.is_long_read()}")
print(f"Is {ebook.title} a long read? {ebook.is_long_read()}")  # Uses the inherited method`,
      explanation: "With inheritance, we can create a DigitalBook class that inherits all the functionality of Book and only adds what's unique to digital books.",
      blockExplanations: [
        "The `DigitalBook` class inherits from `Book` using the syntax `class DigitalBook(Book)`.",
        "In the `__init__` method, we call `super().__init__()` to initialize the parent class's attributes.",
        "We only need to add the new `file_format` attribute specific to digital books.",
        "We override the `get_info` method to include the file format in the output.",
        "All other methods (`check_out`, `return_book`, `is_long_read`) are inherited from `Book`.",
        "This approach eliminates code duplication and clearly expresses that a digital book is a type of book."
      ]
    },
    {
      code: `# Adding a Textbook class with additional functionality
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
        return f"'{self.title}' by {self.author} ({self.genre}, {self.pages} pages) - {status}"

class DigitalBook(Book):
    def __init__(self, title, author, pages, genre, file_format):
        super().__init__(title, author, pages, genre)
        self.file_format = file_format
    
    def get_info(self):
        status = "checked out" if self.is_checked_out else "available"
        return f"'{self.title}' by {self.author} ({self.genre}, {self.pages} pages, {self.file_format}) - {status}"

class Textbook(Book):
    def __init__(self, title, author, pages, genre, subject, edition):
        super().__init__(title, author, pages, genre)
        self.subject = subject
        self.edition = edition
        self.notes = []
    
    def add_note(self, page, note):
        self.notes.append((page, note))
    
    def get_notes(self):
        if not self.notes:
            return "No notes added yet."
        return "\\n".join([f"Page {page}: {note}" for page, note in self.notes])
    
    def get_info(self):
        base_info = super().get_info()
        return f"{base_info} (Subject: {self.subject}, Edition: {self.edition})"

# Create different types of books
book = Book("The Great Gatsby", "F. Scott Fitzgerald", 180, "Fiction")
ebook = DigitalBook("Python Crash Course", "Eric Matthes", 544, "Programming", "PDF")
textbook = Textbook("Introduction to Psychology", "Dr. Smith", 800, "Non-Fiction", "Psychology", "5th")

# Test the methods
print(book.get_info())
print(ebook.get_info())
print(textbook.get_info())

# Test Textbook-specific methods
textbook.add_note(42, "Important concept about memory")
textbook.add_note(87, "Review this section for exam")
print("\\nTextbook notes:")
print(textbook.get_notes())`,
      explanation: "We can create more specialized book types by inheriting from the base Book class. Each derived class can add its own attributes and methods while reusing the common functionality.",
      blockExplanations: [
        "The `Textbook` class inherits from `Book` and adds subject, edition, and notes attributes.",
        "It adds new methods like `add_note` and `get_notes` that are specific to textbooks.",
        "It overrides `get_info` to include the subject and edition, using `super().get_info()` to get the base information.",
        "This demonstrates how inheritance allows for code reuse while enabling specialization.",
        "Each derived class can have its own unique behavior while sharing common functionality with the parent class."
      ]
    },
    {
      code: `# Demonstrating polymorphism with a library catalog
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
        return f"'{self.title}' by {self.author} ({self.genre}, {self.pages} pages) - {status}"

class DigitalBook(Book):
    def __init__(self, title, author, pages, genre, file_format):
        super().__init__(title, author, pages, genre)
        self.file_format = file_format
    
    def get_info(self):
        status = "checked out" if self.is_checked_out else "available"
        return f"'{self.title}' by {self.author} ({self.genre}, {self.pages} pages, {self.file_format}) - {status}"

class Textbook(Book):
    def __init__(self, title, author, pages, genre, subject, edition):
        super().__init__(title, author, pages, genre)
        self.subject = subject
        self.edition = edition
        self.notes = []
    
    def add_note(self, page, note):
        self.notes.append((page, note))
    
    def get_notes(self):
        if not self.notes:
            return "No notes added yet."
        return "\\n".join([f"Page {page}: {note}" for page, note in self.notes])
    
    def get_info(self):
        base_info = super().get_info()
        return f"{base_info} (Subject: {self.subject}, Edition: {self.edition})"

# Create a library catalog with different types of books
library_catalog = [
    Book("The Great Gatsby", "F. Scott Fitzgerald", 180, "Fiction"),
    DigitalBook("Python Crash Course", "Eric Matthes", 544, "Programming", "PDF"),
    Textbook("Introduction to Psychology", "Dr. Smith", 800, "Non-Fiction", "Psychology", "5th"),
    Book("War and Peace", "Leo Tolstoy", 1225, "Historical Fiction"),
    DigitalBook("Data Science Handbook", "Jane Doe", 450, "Programming", "EPUB")
]

# Process all books uniformly using polymorphism
print("Library Catalog:")
for book in library_catalog:
    print(book.get_info())  # Calls the appropriate get_info method for each type
    print(f"Is a long read? {book.is_long_read()}")  # Uses the inherited method
    print()

# Check out all books
print("Checking out all books:")
for book in library_catalog:
    book.check_out()  # Uses the inherited method
    print(book.get_info())
    print()`,
      explanation: "Polymorphism allows us to treat objects of different classes uniformly through their common interface. We can store different types of books in a list and process them using the same code.",
      blockExplanations: [
        "We define `Book` as a base class with common attributes and methods. `DigitalBook` and `Textbook` inherit from `Book`.",
        "We create a `library_catalog` list that contains different types of books: regular `Book`, `DigitalBook`, and `Textbook` objects.",
        "When we iterate through the list and call `book.get_info()`, Python automatically calls the appropriate version of the method for each object type.",
        "This is polymorphism in action - the same code works with different types of objects.",
        "We can also call inherited methods like `is_long_read()` and `check_out()` on any book object, regardless of its specific type.",
        "This demonstrates how inheritance and polymorphism make our code more flexible and extensible."
      ]
    }
  ];

  return (
    <div className="my-8">
      <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">The Evolution of Code Organization: Library Book Types</h3>
      <p className="mb-4 text-[var(--text-primary)]">
        Before diving into inheritance and polymorphism for our student data, let's understand how these concepts work 
        using a simple library book example that builds on our previous class discussion.
      </p>
      
      <p className="mb-4 bg-yellow-50 dark:bg-yellow-900/30 p-3 border-l-4 border-yellow-400 dark:border-yellow-700 italic text-[var(--text-primary)]">
        <strong>Scenario:</strong> Imagine you're expanding the university library software to handle different types of books: 
        regular books, digital books (e-books), and textbooks. Each type has some common properties and behaviors, but also 
        unique characteristics. As you work through this example, think about how inheritance and polymorphism can help you 
        model these relationships efficiently.
      </p>
      
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6 border border-blue-100 dark:border-blue-800">
        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Step-by-Step Code Evolution</h4>
        <p className="text-blue-700 dark:text-blue-300">
          Below is a guided walkthrough of how code can evolve from basic classes to inheritance and polymorphism:
        </p>
        <ul className="text-blue-700 dark:text-blue-300 mt-2 list-disc pl-5 space-y-1">
          <li>Navigate through each stage using the arrows or dots</li>
          <li>Each stage shows a different approach to the same problem</li>
          <li>The floating box explains the key concepts of each approach</li>
          <li>Within each stage, you can click through highlighted code blocks</li>
        </ul>
      </div>
      
      <CodeSlider 
        slides={slides}
        language="python"
        title="Library Book Types: From Basic Classes to Inheritance and Polymorphism"
        showLineNumbers={true}
      />
      
      <div className="mt-5 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md">
        <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Benefits of Inheritance and Polymorphism</h4>
        <p className="text-green-700 dark:text-green-300 mb-2">
          Notice how inheritance and polymorphism offer many advantages:
        </p>
        <ol className="list-decimal pl-5 text-green-700 dark:text-green-300 space-y-1">
          <li><strong>Code Reuse</strong>: Common functionality is defined once in the parent class and inherited by child classes</li>
          <li><strong>Specialization</strong>: Child classes can add new attributes and methods or override existing ones</li>
          <li><strong>Polymorphism</strong>: Objects of different classes can be treated uniformly through their common interface</li>
          <li><strong>Maintainability</strong>: Changes to common behavior only need to be made in one place (the parent class)</li>
          <li><strong>Extensibility</strong>: New types can be added by creating new child classes without modifying existing code</li>
        </ol>
      </div>
    </div>
  );
};

export default InheritanceWarmup; 