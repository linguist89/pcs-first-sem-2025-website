#!/usr/bin/env node

// This is a simple wrapper to run the conversion script
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the conversion script
const scriptPath = join(__dirname, 'src', 'scripts', 'convertSelectedLessons.js');

console.log(`Running conversion script: ${scriptPath}`);

// Run the script with babel-node to handle ES modules
const child = spawn('npx', ['babel-node', scriptPath], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  console.log(`Conversion script exited with code ${code}`);
  process.exit(code);
}); 