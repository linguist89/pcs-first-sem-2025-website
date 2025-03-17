import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Sample lesson content to create if no lessons exist
const sampleLessonContent = `---
title: Introduction to Functions
description: Learn the basics of functions in Python and how to use them effectively
difficulty: Beginner
duration: 30 minutes
---

# Scenario
Sarah, the team lead, approached Mark with a file in hand. "Mark, we've got this eye-tracking data," she said, placing the file on his desk. "It's a bit of a mess, but we need to figure out [1 how long users are looking at different parts of our interface]. [2 We're hoping to find patterns] – like, what's catching their attention? Can you clean this up and give us some basic stats? [3 We need to know the number of valid data points, the average gaze duration, and the variability of longer gazes]." She added, "Let's start simple and build up from there."

## Objective
Sarah wants Mark to analyze eye-tracking data to understand user attention. To do this, Mark needs to:

1.  **Clean the data:** Remove invalid entries like "NA", "error", and "NaN".
2.  **Calculate basic statistics:** Find the number of valid data points, the average gaze duration, and the standard deviation of longer gaze durations.
3.  **Identify patterns:** Determine what parts of the interface are holding user attention.
`;

// Ensure the lessons directory exists and has at least one lesson
function ensureLessonsDirectory() {
  const lessonsDirectory = path.join(process.cwd(), 'public', 'data', 'Lessons');
  
  // Create directories if they don't exist
  if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
    fs.mkdirSync(path.join(process.cwd(), 'public'));
  }
  
  if (!fs.existsSync(path.join(process.cwd(), 'public', 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'public', 'data'));
  }
  
  if (!fs.existsSync(lessonsDirectory)) {
    fs.mkdirSync(lessonsDirectory);
  }
  
  // Check if the directory is empty
  const files = fs.readdirSync(lessonsDirectory);
  if (files.length === 0) {
    // Create a sample lesson
    fs.writeFileSync(
      path.join(lessonsDirectory, '01-introduction-to-functions.md'),
      sampleLessonContent
    );
  }
  
  return lessonsDirectory;
}

export async function GET() {
  try {
    // Ensure the lessons directory exists and has content
    const lessonsDirectory = ensureLessonsDirectory();
    
    const lessonFiles = fs.readdirSync(lessonsDirectory)
      .filter(file => file.endsWith('.md'));
    
    // If there are still no lesson files (something went wrong), return empty array
    if (lessonFiles.length === 0) {
      return NextResponse.json([]);
    }
    
    // Parse each file and extract frontmatter
    const lessons = lessonFiles.map(file => {
      const fullPath = path.join(lessonsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      try {
        const { data: frontmatter } = matter(fileContents);
        
        // Get the lesson number from the filename (e.g., "01" from "01-introduction-to-functions.md")
        const fileName = path.parse(file).name;
        const lessonNumber = fileName.split('-')[0];
        
        // Extract a short excerpt from the content for preview
        const excerpt = fileContents
          .replace(/---[\s\S]*?---/, '') // Remove frontmatter
          .replace(/#+\s.*\n/g, '')      // Remove headings
          .replace(/\[.*?\]/g, '')       // Remove markdown links
          .replace(/\n/g, ' ')           // Replace newlines with spaces
          .trim()
          .substring(0, 150) + '...';    // Limit to 150 chars
        
        return {
          id: lessonNumber,
          slug: fileName,
          title: frontmatter.title || 'Untitled Lesson',
          description: frontmatter.description || excerpt,
          difficulty: frontmatter.difficulty || 'Intermediate',
          duration: frontmatter.duration || '30 minutes',
          ...frontmatter
        };
      } catch (err) {
        console.error(`Error parsing frontmatter for ${file}:`, err);
        return null;
      }
    }).filter(Boolean); // Remove any null entries from parsing errors
    
    // Sort by lesson number
    lessons.sort((a, b) => {
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      return numA - numB;
    });
    
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to load lessons' }, { status: 500 });
  }
} 