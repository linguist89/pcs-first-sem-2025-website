/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Original system colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Base color system
        primary: {
          DEFAULT: "var(--primary-color)",
          light: "color-mix(in srgb, var(--primary-color), white 30%)",
          dark: "color-mix(in srgb, var(--primary-color), black 20%)",
        },
        secondary: {
          DEFAULT: "var(--secondary-color)",
          light: "color-mix(in srgb, var(--secondary-color), white 30%)",
          dark: "color-mix(in srgb, var(--secondary-color), black 20%)",
        },
        accent: {
          DEFAULT: "var(--accent-color)",
          light: "color-mix(in srgb, var(--accent-color), white 30%)",
          dark: "color-mix(in srgb, var(--accent-color), black 20%)",
        },
        
        // Text colors
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          inverse: "var(--text-inverse)",
        },
        
        // Background colors
        bg: {
          primary: "var(--background-primary)",
          secondary: "var(--background-secondary)",
          accent: "var(--background-accent)",
        },
        
        // Border colors
        border: {
          light: "var(--border-light)",
          dark: "var(--border-dark)",
        },
        
        // Semantic colors
        success: "var(--success-color)",
        error: "var(--error-color)",
        warning: "var(--warning-color)",
        info: "var(--info-color)",
      },
      boxShadow: {
        'light': '0 1px 3px var(--shadow-light)',
        'medium': '0 4px 6px var(--shadow-light), 0 1px 3px var(--shadow-dark)',
        'heavy': '0 10px 15px -3px var(--shadow-light), 0 4px 6px var(--shadow-dark)',
      },
    },
  },
  plugins: [],
};
