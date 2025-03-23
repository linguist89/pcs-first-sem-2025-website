/**
 * Lesson JSON Schema
 * 
 * This module defines the structure for lesson JSON files
 */

export const lessonSchema = {
  "type": "object",
  "required": ["id", "title", "content"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the lesson"
    },
    "title": {
      "type": "string",
      "description": "Title of the lesson"
    },
    "description": {
      "type": "string",
      "description": "Brief description of the lesson"
    },
    "difficulty": {
      "type": "string",
      "enum": ["Beginner", "Intermediate", "Advanced"],
      "default": "Intermediate",
      "description": "Difficulty level of the lesson"
    },
    "duration": {
      "type": "string",
      "description": "Estimated time to complete the lesson"
    },
    "topics": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Topics covered in the lesson"
    },
    "content": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["type"],
        "properties": {
          "type": {
            "type": "string",
            "enum": ["text", "code", "interactiveCode", "exercise", "scenario", "media", "quiz"],
            "description": "Type of content section"
          }
        },
        "allOf": [
          {
            "if": {
              "properties": { "type": { "enum": ["text"] } }
            },
            "then": {
              "required": ["content"],
              "properties": {
                "title": { "type": "string" },
                "content": { "type": "string" }
              }
            }
          },
          {
            "if": {
              "properties": { "type": { "enum": ["code"] } }
            },
            "then": {
              "required": ["content"],
              "properties": {
                "language": { "type": "string", "default": "python" },
                "content": { "type": "string" },
                "caption": { "type": "string" },
                "showLineNumbers": { "type": "boolean", "default": true }
              }
            }
          },
          {
            "if": {
              "properties": { "type": { "enum": ["interactiveCode"] } }
            },
            "then": {
              "required": ["starterCode"],
              "properties": {
                "title": { "type": "string" },
                "description": { "type": "string" },
                "starterCode": { "type": "string" },
                "language": { "type": "string", "default": "python" },
                "solution": { "type": "string" },
                "caption": { "type": "string" },
                "showLineNumbers": { "type": "boolean", "default": true },
                "instructions": { "type": "string" }
              }
            }
          },
          {
            "if": {
              "properties": { "type": { "enum": ["exercise"] } }
            },
            "then": {
              "required": ["title", "instructions"],
              "properties": {
                "title": { "type": "string" },
                "instructions": { "type": "string" },
                "difficulty": { 
                  "type": "string",
                  "enum": ["beginner", "intermediate", "advanced"],
                  "default": "intermediate"
                },
                "starterCode": { "type": "string" },
                "solution": { "type": "string" },
                "language": { "type": "string", "default": "python" }
              }
            }
          },
          {
            "if": {
              "properties": { "type": { "enum": ["scenario"] } }
            },
            "then": {
              "required": ["content"],
              "properties": {
                "title": { "type": "string" },
                "content": { "type": "string" },
                "highlightedContent": { "type": "string" },
                "objective": { "type": "string" }
              }
            }
          },
          {
            "if": {
              "properties": { "type": { "enum": ["media"] } }
            },
            "then": {
              "required": ["src"],
              "properties": {
                "src": { "type": "string" },
                "alt": { "type": "string" },
                "caption": { "type": "string" },
                "type": { 
                  "type": "string",
                  "enum": ["image", "video"],
                  "default": "image"
                },
                "width": { "type": "number", "default": 800 },
                "height": { "type": "number", "default": 450 }
              }
            }
          },
          {
            "if": {
              "properties": { "type": { "enum": ["quiz"] } }
            },
            "then": {
              "required": ["title", "questions"],
              "properties": {
                "title": { "type": "string" },
                "questions": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": ["question", "options", "correctAnswer"],
                    "properties": {
                      "question": { "type": "string" },
                      "options": {
                        "type": "array",
                        "items": { "type": "string" }
                      },
                      "correctAnswer": { "type": "number" },
                      "explanation": { "type": "string" }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    }
  }
};

/**
 * Validates lesson data against the schema
 * (Basic validation - a more robust implementation would use a proper validation library)
 * 
 * @param {Object} lessonData - The lesson data to validate
 * @returns {Object} Validation result with isValid and errors properties
 */
export function validateLesson(lessonData) {
  const errors = [];
  
  // Check required top-level fields
  if (!lessonData.id) errors.push('Missing required field: id');
  if (!lessonData.title) errors.push('Missing required field: title');
  if (!lessonData.content) errors.push('Missing required field: content');
  
  // Check that content is an array
  if (!Array.isArray(lessonData.content)) {
    errors.push('Content must be an array');
  } else {
    // Validate each content section
    lessonData.content.forEach((section, index) => {
      if (!section.type) {
        errors.push(`Content section ${index} is missing required field: type`);
        return;
      }
      
      switch (section.type) {
        case 'text':
          if (!section.content) errors.push(`Text section ${index} is missing required field: content`);
          break;
          
        case 'code':
          if (!section.content) errors.push(`Code section ${index} is missing required field: content`);
          break;
          
        case 'interactiveCode':
          if (!section.starterCode) errors.push(`InteractiveCode section ${index} is missing required field: starterCode`);
          break;
          
        case 'exercise':
          if (!section.title) errors.push(`Exercise section ${index} is missing required field: title`);
          if (!section.instructions) errors.push(`Exercise section ${index} is missing required field: instructions`);
          break;
          
        case 'scenario':
          if (!section.content) errors.push(`Scenario section ${index} is missing required field: content`);
          break;
          
        case 'media':
          if (!section.src) errors.push(`Media section ${index} is missing required field: src`);
          break;
          
        case 'quiz':
          if (!section.title) errors.push(`Quiz section ${index} is missing required field: title`);
          if (!section.questions || !Array.isArray(section.questions)) {
            errors.push(`Quiz section ${index} is missing required field: questions (array)`);
          } else {
            section.questions.forEach((q, qIndex) => {
              if (!q.question) errors.push(`Quiz ${index} question ${qIndex} is missing required field: question`);
              if (!q.options || !Array.isArray(q.options)) {
                errors.push(`Quiz ${index} question ${qIndex} is missing required field: options (array)`);
              }
              if (q.correctAnswer === undefined) {
                errors.push(`Quiz ${index} question ${qIndex} is missing required field: correctAnswer`);
              }
            });
          }
          break;
          
        default:
          errors.push(`Unknown content type in section ${index}: ${section.type}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export default lessonSchema; 