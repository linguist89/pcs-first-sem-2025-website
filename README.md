This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Custom Components

### CodeSlider

The `CodeSlider` component creates interactive learning experiences by guiding users through a sequence of code evolution. It's designed for teaching coding concepts by showing the progression from simple to more advanced implementations.

#### Features

- **Block-based focus**: Automatically detects code blocks based on comments and focuses on one block at a time
- **Progressive navigation**: Step through each block before moving to the next slide
- **Block-specific explanations**: Each code block can have its own targeted explanation
- **Smart spotlight**: Spotlight focus is automatically enabled when showing explanations for better context
- **Toggleable spotlight**: Users can disable the spotlight effect to view the entire code without dimming
- **Draggable explanations**: Explanation boxes can be moved anywhere on screen and maintain position when navigating
- **Rich content**: Supports Markdown formatting including bold, italic, lists, and code snippets
- **Animated transitions**: Smooth transitions between code slides with fade effects
- **Dot navigation**: Allows users to jump between slides

#### Usage Example

```jsx
import CodeSlider from '@/components/lessons/CodeSlider';

const slides = [
  {
    code: `# First code block
console.log("Hello World");

# Second code block
function greet(name) {
  console.log("Hello " + name);
}

# Third code block
greet("World");`,
    blockExplanations: [
      "This is a simple Hello World example that prints to the console directly.",
      "Here we define a reusable function that can greet any name we provide.",
      "Now we call our function with the 'World' argument."
    ]
  }
];

function MyComponent() {
  return <CodeSlider slides={slides} />;
}
```

See a live demo at `/examples/codeslider`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
