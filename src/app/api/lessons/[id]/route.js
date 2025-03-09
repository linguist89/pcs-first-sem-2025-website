import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(request, context) {
  const { id } = await context.params;
  
  try {
    // Find the matching markdown file in the public/data/Lessons directory
    const lessonsDirectory = path.join(process.cwd(), 'public', 'data', 'Lessons');
    const lessonFiles = fs.readdirSync(lessonsDirectory);
    
    // Try to find either id-*.md or *-id.md pattern
    let lessonFile;
    
    // Exact numeric ID match
    lessonFile = lessonFiles.find(file => {
      // Parse the front matter to check the ID
      const fullPath = path.join(lessonsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return data.id.toString() === id;
    });
    
    if (!lessonFile) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    
    // Read the markdown file
    const fullPath = path.join(lessonsDirectory, lessonFile);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Parse front matter
    const { data: frontmatter, content } = matter(fileContents);
    
    // Return both frontmatter and content
    return NextResponse.json({ frontmatter, content });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json({ error: 'Failed to load lesson' }, { status: 500 });
  }
} 