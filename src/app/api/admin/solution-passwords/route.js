import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the solution passwords file
const getPasswordsFilePath = () => {
  return path.join(process.cwd(), 'src', 'data', 'solutionPasswords.json');
};

// Get the password data
const getPasswordsData = () => {
  const passwordsFilePath = getPasswordsFilePath();
  
  // Check if the file exists
  if (!fs.existsSync(passwordsFilePath)) {
    // Create an empty passwords file if it doesn't exist
    const emptyPasswordsData = { passwords: {} };
    fs.writeFileSync(passwordsFilePath, JSON.stringify(emptyPasswordsData, null, 2), 'utf8');
    return emptyPasswordsData;
  }
  
  // Read the passwords file
  const fileContents = fs.readFileSync(passwordsFilePath, 'utf8');
  return JSON.parse(fileContents);
};

// Save the password data
const savePasswordsData = (data) => {
  const passwordsFilePath = getPasswordsFilePath();
  fs.writeFileSync(passwordsFilePath, JSON.stringify(data, null, 2), 'utf8');
};

/**
 * GET solution passwords endpoint for admin
 * Returns a list of all exercises and their passwords
 */
export async function GET() {
  try {
    // Get the passwords data
    const passwordsData = getPasswordsData();
    
    return NextResponse.json(passwordsData);
  } catch (error) {
    console.error('Error retrieving solution passwords:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve solution passwords: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST solution password endpoint for admin
 * Adds or updates a password for a specific exercise
 */
export async function POST(request) {
  try {
    // Get the exercise ID and password from the request body
    const { exerciseId, password } = await request.json();
    
    if (!exerciseId || !password) {
      return NextResponse.json(
        { error: 'Exercise ID and password are required' },
        { status: 400 }
      );
    }
    
    // Get the current passwords data
    const passwordsData = getPasswordsData();
    
    // Update the password
    if (!passwordsData.passwords) {
      passwordsData.passwords = {};
    }
    
    passwordsData.passwords[exerciseId] = password;
    
    // Save the updated passwords data
    savePasswordsData(passwordsData);
    
    return NextResponse.json(passwordsData);
  } catch (error) {
    console.error('Error updating solution password:', error);
    return NextResponse.json(
      { error: 'Failed to update solution password: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE solution password endpoint for admin
 * Removes a password for a specific exercise
 */
export async function DELETE(request) {
  try {
    // Get the exercise ID from the request body
    const { exerciseId } = await request.json();
    
    if (!exerciseId) {
      return NextResponse.json(
        { error: 'Exercise ID is required' },
        { status: 400 }
      );
    }
    
    // Get the current passwords data
    const passwordsData = getPasswordsData();
    
    // Remove the password
    if (passwordsData.passwords && passwordsData.passwords[exerciseId]) {
      delete passwordsData.passwords[exerciseId];
      
      // Save the updated passwords data
      savePasswordsData(passwordsData);
    }
    
    return NextResponse.json(passwordsData);
  } catch (error) {
    console.error('Error removing solution password:', error);
    return NextResponse.json(
      { error: 'Failed to remove solution password: ' + error.message },
      { status: 500 }
    );
  }
} 