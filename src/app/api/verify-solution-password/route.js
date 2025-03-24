import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * POST solution password verification endpoint
 * Verifies if the provided password matches the stored password for a specific exercise
 */
export async function POST(request) {
  try {
    // Get the exercise ID and password from the request body
    const { exerciseId, password } = await request.json();
    
    if (!exerciseId || !password) {
      return NextResponse.json(
        { success: false, error: 'Exercise ID and password are required' },
        { status: 400 }
      );
    }
    
    // Path to the solution passwords file
    const passwordsFilePath = path.join(process.cwd(), 'src', 'data', 'solutionPasswords.json');
    
    // Check if the file exists
    if (!fs.existsSync(passwordsFilePath)) {
      return NextResponse.json(
        { success: false, error: 'Password file not found' },
        { status: 404 }
      );
    }
    
    // Read the passwords file
    const fileContents = fs.readFileSync(passwordsFilePath, 'utf8');
    const passwordsData = JSON.parse(fileContents);
    
    // Check if the exercise has a password
    if (!passwordsData.passwords || !passwordsData.passwords[exerciseId]) {
      return NextResponse.json(
        { success: false, error: 'No password set for this exercise' },
        { status: 404 }
      );
    }
    
    // Verify the password
    const isCorrect = passwordsData.passwords[exerciseId] === password;
    
    return NextResponse.json({ success: isCorrect });
  } catch (error) {
    console.error('Error verifying solution password:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify solution password' },
      { status: 500 }
    );
  }
} 