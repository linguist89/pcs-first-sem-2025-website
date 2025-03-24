import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET solution passwords endpoint
 * Returns a list of all exercises that have passwords (but not the passwords themselves)
 */
export async function GET() {
  try {
    // Path to the solution passwords file
    const passwordsFilePath = path.join(process.cwd(), 'src', 'data', 'solutionPasswords.json');
    
    // Check if the file exists
    if (!fs.existsSync(passwordsFilePath)) {
      // Create an empty passwords file if it doesn't exist
      const emptyPasswordsData = { passwords: {} };
      fs.writeFileSync(passwordsFilePath, JSON.stringify(emptyPasswordsData, null, 2), 'utf8');
      return NextResponse.json(emptyPasswordsData);
    }
    
    // Read the passwords file
    const fileContents = fs.readFileSync(passwordsFilePath, 'utf8');
    const passwordsData = JSON.parse(fileContents);
    
    // Return the data (with only exercise IDs, not the actual passwords)
    const safeData = {
      passwords: Object.keys(passwordsData.passwords || {}).reduce((acc, exerciseId) => {
        acc[exerciseId] = true; // Just indicate that a password exists, don't send the actual password
        return acc;
      }, {})
    };
    
    return NextResponse.json(safeData);
  } catch (error) {
    console.error('Error retrieving solution passwords:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve solution passwords' },
      { status: 500 }
    );
  }
} 