import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string, merging Tailwind classes properly
 * to avoid conflicts. Uses clsx for conditional class names and tailwind-merge to resolve
 * conflicting Tailwind classes.
 * 
 * @param {...(string|object|array)} inputs - Class names to combine
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
} 