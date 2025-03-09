---
id: 1
title: "Introduction to HTML"
description: "Learn the basics of HTML structure and elements"
image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
module: "Web Development Fundamentals"
duration: 45
difficulty: "Beginner"
lastUpdated: "2023-03-01T14:30:00"
progress: 100
prerequisites: ["None"]
learningObjectives:
  - "Understand the basic structure of HTML documents"
  - "Create and use various HTML elements"
  - "Apply semantic HTML principles to improve page structure"
---

## Welcome to HTML

HTML (HyperText Markup Language) is the foundation of all web pages. It's not a programming language but a markup language that tells web browsers how to structure the content you see online. In this lesson, you'll learn the fundamentals of HTML and create your first web pages from scratch.

By the end of this lesson, you'll understand how HTML documents are structured, how to use various HTML elements, and how semantic HTML improves accessibility and SEO.

## HTML Document Structure

Every HTML document follows a standard structure that includes a doctype declaration, an html element, head and body sections. The head contains metadata about the document while the body contains the content that is visible to users.

The basic structure serves as the skeleton for all web pages you'll create. Let's examine each part:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First HTML Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my first HTML page.</p>
</body>
</html>
```

This example shows the essential elements of an HTML document:
- The DOCTYPE declaration tells the browser which version of HTML is being used
- The `<html>` element is the container for all HTML content
- The lang attribute specifies the language
- The `<head>` section contains metadata
- The `<meta>` tags provide information about character encoding and viewport settings
- The `<title>` element sets the page title shown in the browser tab
- The `<body>` section contains all visible content
- The `<h1>` and `<p>` elements are examples of content elements

![HTML Document Tree Structure](https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80)
*HTML documents follow a tree-like structure where elements can contain other elements, creating a hierarchy of parent and child relationships. This nesting structure is fundamental to understanding how HTML works.*

## Basic HTML Elements

HTML provides a variety of elements to structure and present content. These include headings, paragraphs, lists, links, images, tables, forms, and more. Each element serves a specific purpose and has its own syntax and attributes.

Let's explore some of the most commonly used HTML elements that you'll use in nearly every web page you create:

```html
<!-- Headings from most important (h1) to least important (h6) -->
<h1>Main Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

<!-- Paragraph -->
<p>This is a paragraph of text. HTML will automatically wrap the text to fit the width of the container.</p>

<!-- Text formatting -->
<p>This text is <strong>bold</strong> and this is <em>italic</em>.</p>

<!-- Lists -->
<h3>Unordered List</h3>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<h3>Ordered List</h3>
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>

<!-- Links -->
<p>Visit <a href="https://www.example.com">Example.com</a> for more information.</p>

<!-- Images -->
<img src="example-image.jpg" alt="Description of the image" width="300" height="200">
```

These examples demonstrate common HTML elements:
- Headings (h1-h6) establish a hierarchical structure
- Paragraphs (p) contain blocks of text
- Strong and em provide emphasis (bold and italic styling)
- Lists organize content in bullet points (ul) or numbered steps (ol)
- Links (a) connect to other pages with the href attribute
- Images (img) display pictures with src, alt, width, and height attributes

## HTML Element Playground

Try modifying the HTML code below to see how different elements and attributes affect the output.

```html
<div class="container">
  <h1>My Web Page</h1>
  <p>Edit this code to experiment with different HTML elements.</p>
  <!-- Try adding your own elements here -->
</div>
```

### Instructions:
1. Try adding a list (ul or ol)
2. Add an image (use a placeholder URL like 'https://via.placeholder.com/150')
3. Create a link to your favorite website
4. Add another heading level (h2, h3)
5. Experiment with text formatting (strong, em, small, etc.)

## Semantic HTML

Semantic HTML uses elements that convey meaning about the structure and content of a web page, rather than just how it looks. By using semantic elements like `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>`, you make your HTML more accessible to screen readers, easier for search engines to understand, and simpler to style with CSS.

Compare these two approaches to creating a simple web page structure:

```html
<!-- Non-semantic approach using generic divs -->
<div class="header">
  <h1>Website Title</h1>
  <div class="navigation">
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </div>
</div>
<div class="content">
  <div class="article">
    <h2>Article Title</h2>
    <p>Article content goes here...</p>
  </div>
  <div class="sidebar">
    <h3>Related Links</h3>
    <ul>
      <li><a href="#">Link 1</a></li>
      <li><a href="#">Link 2</a></li>
    </ul>
  </div>
</div>
<div class="footer">
  <p>&copy; 2023 My Website</p>
</div>

<!-- Semantic approach using meaningful elements -->
<header>
  <h1>Website Title</h1>
  <nav>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h2>Article Title</h2>
    <p>Article content goes here...</p>
  </article>
  <aside>
    <h3>Related Links</h3>
    <ul>
      <li><a href="#">Link 1</a></li>
      <li><a href="#">Link 2</a></li>
    </ul>
  </aside>
</main>
<footer>
  <p>&copy; 2023 My Website</p>
</footer>
```

The semantic version:
- Replaces generic `<div>` elements with semantic elements like `<header>`, `<nav>`, `<main>`, etc.
- Provides clear structure that assistive technologies can interpret
- Makes the code more readable and maintainable
- Helps search engines understand the page structure for better SEO
- Requires less reliance on class names to convey meaning

![Semantic vs Non-Semantic HTML](https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80)
*While both approaches might look identical in the browser, semantic HTML provides clear structural meaning that improves accessibility and SEO.*

1. Which HTML element is used to define the main heading of a document?
   - `<header>`
   - `<h1>` (correct)
   - `<heading>`
   - `<main>`

2. Which attribute is required in the `<img>` tag?
   - `src` (correct)
   - `alt`
   - `width`
   - `height`

3. Which element represents a semantic section of a webpage?
   - `<div>`
   - `<span>`
   - `<section>` (correct)
   - `<content>`

## Create a Basic HTML Page

Create a simple HTML page with the following elements:
1. A proper HTML5 document structure
2. A page title of 'About Me'
3. A main heading with your name (or any name)
4. A paragraph about yourself (or fictional information)
5. A subheading titled 'My Hobbies'
6. An unordered list with at least three hobbies
7. A second subheading titled 'My Favorite Websites'
8. An ordered list with at least three websites as links

You can use any text editor to create this file, save it as 'about.html', and open it in a browser to view the result.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title></title>
</head>
<body>
  <!-- Add your content here -->
  
</body>
</html>
```

## Add Links and Images

Enhance your 'About Me' page by adding:
1. A profile image (you can use a placeholder image)
2. A link to your email (using mailto:)
3. A list of social media profiles (real or fictional)
4. Add a semantic footer with copyright information

Make sure to include appropriate alt text for your image and organize the content semantically.

## Summary

In this lesson, you've learned the fundamentals of HTML, including:

- The basic structure of an HTML document with doctype, head, and body sections
- Common HTML elements for text, links, images, and lists
- The importance of semantic HTML for accessibility and SEO
- How to create a complete webpage with proper structure

These skills form the foundation of web development and will be essential as you progress to more advanced topics like CSS for styling and JavaScript for interactivity. Remember that well-structured HTML makes your websites more accessible, easier to maintain, and better for search engine optimization.

## Additional Resources

- [MDN Web Docs - HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) - Comprehensive reference for HTML elements, attributes, and best practices
- [W3Schools HTML Tutorial](https://www.w3schools.com/html/) - Interactive tutorials with examples and exercises
- [HTML5 Doctor](http://html5doctor.com/) - Detailed articles about semantic HTML5 elements
- [Can I Use](https://caniuse.com/) - Browser compatibility tables for HTML5 features 