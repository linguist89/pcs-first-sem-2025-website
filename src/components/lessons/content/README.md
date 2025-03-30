# Content Components

This directory contains reusable components for rendering different types of lesson content.

## CodeSlider Component

The `CodeSlider` component is designed to show a progression of code examples, allowing users to click through steps that show code evolution (such as from messy code to functions to classes).

### Features

- **Centered Explanation Overlays**: Explanations appear as clear overlay cards on top of the code for maximum visibility
- **Explanation Toggle**: Users can hide/show explanations to focus on code when needed
- **Line Highlighting**: Important code sections are highlighted to guide the user's focus
- **Visual Focus Points**: Animated indicators draw attention to specific areas of interest
- **Smooth Fade Animations**: Code blocks fade in and out with a subtle scale effect for seamless transitions
- **Consistent Container Size**: Container maintains the same dimensions across all slides
- **Side Navigation**: Intuitive navigation arrows on the sides of the code panel for easy browsing
- **Progress Indicators**: Visual indicators show current position with clickable dots for direct navigation
- **Responsive Layout**: Adjusts to different screen sizes
- **Markdown Support**: Explanations support Markdown formatting
- **Copy to Clipboard**: Easily copy code with a single click
- **Auto-transition**: Optional auto-advancement of slides (can be disabled)

### Usage

Import and use the `CodeSlider` component in your lesson content:

```jsx
import { CodeSlider } from '@/components/lessons/content';

// In your component:
<CodeSlider
  slides={[
    {
      code: "// Your first code block here",
      explanation: "Explanation for the first slide",
      focusLines: [2, 3], // Optional: Highlight line numbers 2 and 3
      focusPoint: { x: 30, y: 20 } // Optional: Add a focus point at 30% from left, 20% from top
    },
    {
      code: "// Your second code block here",
      explanation: "Explanation for the second slide",
      focusLines: [4, 5, 6]
    }
    // Add more slides as needed
  ]}
  language="javascript" // Programming language for syntax highlighting
  title="Evolution of Code" // Optional title
  showLineNumbers={true} // Optional, defaults to true
  autoTransitionDelay={0} // Optional, set to milliseconds for auto-transition (0 disables)
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slides` | Array | `[]` | Array of slide objects, each containing `code`, `explanation`, and optional `focusLines` and `focusPoint` |
| `language` | String | `'python'` | Programming language for syntax highlighting |
| `showLineNumbers` | Boolean | `true` | Whether to show line numbers in the code block |
| `title` | String | - | Optional title for the slider |
| `autoTransitionDelay` | Number | `0` | Delay in milliseconds for auto-transitioning slides (0 disables) |

### Slide Object Properties

Each slide in the `slides` array supports the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `code` | String | The code to display (required) |
| `explanation` | String | Explanation text that supports Markdown formatting (required) |
| `focusLines` | Array | Array of line numbers to highlight (optional) |
| `focusPoint` | Object | `{x, y}` coordinates for a focus point indicator, as percentages (optional) |

### Animation Behavior

The CodeSlider uses a smooth fade transition with a subtle scaling effect to morph between different code blocks:

1. The current code block gently fades out while slightly scaling up
2. The new code block fades in while scaling from slightly smaller to normal size
3. The explanation overlay animates in centered on top of the code
4. Focus highlights and indicators animate in to guide the user's attention

The component automatically calculates the optimal container height based on the content of all slides to maintain a consistent size throughout transitions, preventing jarring layout shifts.

### Learning Experience Features

The CodeSlider provides several features to create an engaging, guided learning experience:

1. **Centered Explanation Overlays**:
   - Explanations appear in modal-like overlay cards centered on top of the code
   - Semi-transparent backdrop ensures explanations are clearly visible while still showing the code context
   - Users can toggle explanations on/off with dedicated buttons for flexibility
   - When hidden, a small info button appears to restore the explanation

2. **Line Highlighting**:
   - Specify important lines with the `focusLines` property
   - Highlighted lines get a distinct background color and left border
   - This helps learners focus on the most important parts of the code

3. **Focus Points**:
   - Add animated focus points with the `focusPoint` property
   - Pulsing indicators draw attention to specific parts of the code
   - Positioned using percentage-based coordinates for flexibility

### Navigation

- **Side Arrows**: Navigation arrows appear on the left and right sides of the code panel, making it easy to move between slides
- **Progress Dots**: Small dots at the bottom indicate the total number of slides and current position
- **Direct Navigation**: Click on any dot to jump directly to that slide
- **Explanation Toggle**: Users can show/hide explanations as needed

### Using in Lesson Content

To use the CodeSlider in your lesson content JSON, add a content block with type `'codeSlider'`:

```json
{
  "type": "codeSlider",
  "title": "Evolution of Code",
  "language": "python",
  "slides": [
    {
      "code": "# First code example",
      "explanation": "Explanation for the first slide",
      "focusLines": [2, 3],
      "focusPoint": { "x": 50, "y": 30 }
    },
    {
      "code": "# Second code example",
      "explanation": "Explanation for the second slide",
      "focusLines": [1, 4, 5]
    }
  ]
}
```

### Example

See `CodeSliderExample.js` for a complete example of how to use this component to show the progression from messy code to functions to classes with guided attention features.

### Demo Page

Visit `/examples/codeslider` to see the CodeSlider component in action. 