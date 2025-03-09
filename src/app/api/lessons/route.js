import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  try {
    // Get all markdown files from the public/data/Lessons directory
    const lessonsDirectory = path.join(process.cwd(), 'public', 'data', 'Lessons');
    const lessonFiles = fs.readdirSync(lessonsDirectory);
    
    // Parse each file and extract frontmatter
    const lessons = lessonFiles.map(file => {
      const fullPath = path.join(lessonsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data: frontmatter } = matter(fileContents);
      
      return frontmatter;
    });
    
    // Sort by ID
    lessons.sort((a, b) => a.id - b.id);
    
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to load lessons' }, { status: 500 });
  }
} 