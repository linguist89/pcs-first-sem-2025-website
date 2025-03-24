'use client';

import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import dynamic from 'next/dynamic';

// Dynamically import AceEditor with no SSR to avoid hydration issues
const AceEditor = dynamic(
  async () => {
    const ace = await import('react-ace');
    // Import language modules
    await import('ace-builds/src-noconflict/mode-python');
    await import('ace-builds/src-noconflict/mode-javascript');
    await import('ace-builds/src-noconflict/mode-java');
    await import('ace-builds/src-noconflict/mode-html');
    await import('ace-builds/src-noconflict/mode-css');
    await import('ace-builds/src-noconflict/mode-typescript');
    await import('ace-builds/src-noconflict/mode-ruby');
    await import('ace-builds/src-noconflict/mode-csharp');
    await import('ace-builds/src-noconflict/mode-php');
    await import('ace-builds/src-noconflict/mode-golang');
    await import('ace-builds/src-noconflict/mode-sql');
    await import('ace-builds/src-noconflict/mode-r');
    await import('ace-builds/src-noconflict/mode-sh');
    await import('ace-builds/src-noconflict/mode-swift');
    await import('ace-builds/src-noconflict/mode-rust');
    await import('ace-builds/src-noconflict/mode-kotlin');
    await import('ace-builds/src-noconflict/mode-c_cpp');
    
    // Import themes
    await import('ace-builds/src-noconflict/theme-tomorrow_night');
    await import('ace-builds/src-noconflict/theme-github');
    
    // Import extensions
    await import('ace-builds/src-noconflict/ext-language_tools');
    return ace.default;
  },
  { ssr: false }
);

// Map of language values to ace editor modes
const languageToMode = {
  python: 'python',
  javascript: 'javascript',
  bash: 'sh',
  r: 'r',
  sql: 'sql',
  html: 'html',
  css: 'css',
  java: 'java',
  cpp: 'c_cpp',
  csharp: 'csharp',
  php: 'php',
  ruby: 'ruby',
  go: 'golang',
  rust: 'rust',
  swift: 'swift',
  kotlin: 'kotlin',
  typescript: 'typescript'
};

/**
 * Component for editing a specific section type in a lesson
 */
const SectionEditor = ({ section, onChange, onRemove, onMoveUp, onMoveDown, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [language, setLanguage] = useState(section.language || 'python');
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const handleChange = (field, value) => {
    onChange(index, { ...section, [field]: value });
  };

  // The supported languages for code sections
  const supportedLanguages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'bash', label: 'Bash/Shell' },
    { value: 'r', label: 'R' },
    { value: 'sql', label: 'SQL' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'typescript', label: 'TypeScript' }
  ];
  
  // Render different editors based on section type
  const renderEditor = () => {
    switch (section.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (Optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={section.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={6}
                value={section.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
              />
            </div>
            <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm">
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                View this section in the full lesson preview below
              </p>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={section.caption || ''}
                  onChange={(e) => handleChange('caption', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={section.language || 'python'} 
                  onChange={(e) => {
                    const newLanguage = e.target.value;
                    setLanguage(newLanguage);
                    handleChange('language', newLanguage);
                  }}
                >
                  {supportedLanguages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`show-line-numbers-${index}`}
                className="mr-2"
                checked={section.showLineNumbers || false}
                onChange={(e) => handleChange('showLineNumbers', e.target.checked)}
              />
              <label htmlFor={`show-line-numbers-${index}`} className="text-sm text-gray-700">
                Show line numbers
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                {editorLoaded ? (
                  <AceEditor
                    mode={languageToMode[section.language || 'python']}
                    theme="tomorrow_night"
                    value={section.content || ''}
                    onChange={(value) => handleChange('content', value)}
                    name={`code-editor-${index}`}
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                      showLineNumbers: true,
                      tabSize: 2,
                      useWorker: false,
                      fontSize: 14,
                    }}
                    style={{ width: '100%', height: '250px' }}
                  />
                ) : (
                  <textarea
                    className="w-full px-3 py-2 font-mono text-sm"
                    rows={10}
                    value={section.content || ''}
                    onChange={(e) => handleChange('content', e.target.value)}
                    style={{ 
                      lineHeight: '1.5',
                      tabSize: 2
                    }}
                  />
                )}
              </div>
            </div>
            <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm">
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Enable "Auto-Update Preview" in the preview section to see changes in real time
              </p>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={section.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Questions
              </label>
              
              {(section.questions || []).map((question, qIndex) => (
                <div key={qIndex} className="border border-gray-200 p-3 mb-3 rounded-md">
                  <div className="mb-2">
                    <label className="block text-sm text-gray-700 mb-1">
                      Question {qIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={question.question || ''}
                      onChange={(e) => {
                        const newQuestions = [...(section.questions || [])];
                        newQuestions[qIndex] = { ...question, question: e.target.value };
                        handleChange('questions', newQuestions);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="mb-2">
                    <label className="block text-sm text-gray-700 mb-1">
                      Options (one per line)
                    </label>
                    <textarea
                      value={(question.options || []).join('\n')}
                      onChange={(e) => {
                        const options = e.target.value.split('\n').filter(opt => opt.trim() !== '');
                        const newQuestions = [...(section.questions || [])];
                        newQuestions[qIndex] = { ...question, options };
                        handleChange('questions', newQuestions);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
                    />
                  </div>
                  
                  <div className="mb-2">
                    <label className="block text-sm text-gray-700 mb-1">
                      Correct Answer (0-based index)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={(question.options || []).length - 1}
                      value={question.correctAnswer || 0}
                      onChange={(e) => {
                        const newQuestions = [...(section.questions || [])];
                        newQuestions[qIndex] = { 
                          ...question, 
                          correctAnswer: parseInt(e.target.value, 10) 
                        };
                        handleChange('questions', newQuestions);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Explanation
                    </label>
                    <textarea
                      value={question.explanation || ''}
                      onChange={(e) => {
                        const newQuestions = [...(section.questions || [])];
                        newQuestions[qIndex] = { ...question, explanation: e.target.value };
                        handleChange('questions', newQuestions);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const newQuestions = [...(section.questions || [])];
                      newQuestions.splice(qIndex, 1);
                      handleChange('questions', newQuestions);
                    }}
                    className="mt-2 px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Remove Question
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => {
                  const newQuestions = [...(section.questions || []), {
                    question: 'New question',
                    options: ['Option 1', 'Option 2', 'Option 3'],
                    correctAnswer: 0,
                    explanation: ''
                  }];
                  handleChange('questions', newQuestions);
                }}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Question
              </button>
            </div>
          </div>
        );
        
      case 'media':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media Type
              </label>
              <select
                value={section.type || 'image'}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source URL
              </label>
              <input
                type="text"
                value={section.src || ''}
                onChange={(e) => handleChange('src', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text / Description
              </label>
              <input
                type="text"
                value={section.alt || ''}
                onChange={(e) => handleChange('alt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption
              </label>
              <input
                type="text"
                value={section.caption || ''}
                onChange={(e) => handleChange('caption', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <input
                  type="number"
                  value={section.width || 800}
                  onChange={(e) => handleChange('width', parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="number"
                  value={section.height || 450}
                  onChange={(e) => handleChange('height', parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        );

      case 'interactiveCode':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={section.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={section.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={section.language || 'python'} 
                onChange={(e) => handleChange('language', e.target.value)}
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starter Code
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                {editorLoaded ? (
                  <AceEditor
                    mode={languageToMode[section.language || 'python']}
                    theme="tomorrow_night"
                    value={section.starterCode || ''}
                    onChange={(value) => handleChange('starterCode', value)}
                    name={`starter-code-editor-${index}`}
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                      showLineNumbers: true,
                      tabSize: 2,
                      useWorker: false,
                      fontSize: 14,
                    }}
                    style={{ width: '100%', height: '200px' }}
                  />
                ) : (
                  <textarea
                    value={section.starterCode || ''}
                    onChange={(e) => handleChange('starterCode', e.target.value)}
                    className="w-full px-3 py-2 font-mono text-sm"
                    rows={8}
                    style={{ 
                      lineHeight: '1.5',
                      tabSize: 2
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        );
        
      case 'exercise':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={section.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                value={section.difficulty || 'intermediate'}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                value={section.instructions || ''}
                onChange={(e) => handleChange('instructions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starter Code
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                {editorLoaded ? (
                  <AceEditor
                    mode={languageToMode[section.language || 'python']}
                    theme="tomorrow_night"
                    value={section.starterCode || ''}
                    onChange={(value) => handleChange('starterCode', value)}
                    name={`exercise-code-editor-${index}`}
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                      showLineNumbers: true,
                      tabSize: 2,
                      useWorker: false,
                      fontSize: 14,
                    }}
                    style={{ width: '100%', height: '200px' }}
                  />
                ) : (
                  <textarea
                    value={section.starterCode || ''}
                    onChange={(e) => handleChange('starterCode', e.target.value)}
                    className="w-full px-3 py-2 font-mono text-sm"
                    rows={8}
                    style={{ 
                      lineHeight: '1.5',
                      tabSize: 2
                    }}
                  />
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={section.language || 'python'} 
                onChange={(e) => handleChange('language', e.target.value)}
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-md">
            <p>Edit this section in JSON view - specialized editor not available for type: {section.type}</p>
          </div>
        );
    }
  };

  // Render a preview of the section
  const renderPreview = () => {
    switch (section.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            {section.title && <h3 className="text-lg font-medium mb-2">{section.title}</h3>}
            <div className="whitespace-pre-wrap">{section.content}</div>
          </div>
        );

      case 'code':
        return (
          <div>
            {section.caption && <p className="text-sm text-gray-500 mb-1">{section.caption}</p>}
            <div className="rounded-md overflow-hidden">
              <SyntaxHighlighter
                language={section.language || 'python'}
                style={tomorrow}
                showLineNumbers={section.showLineNumbers}
                wrapLines={true}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              >
                {section.content || '# Enter your code here'}
              </SyntaxHighlighter>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="font-medium text-blue-800 mb-3">{section.title || 'Quiz'}</h3>
            {(section.questions || []).map((q, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <p className="font-medium mb-2">{i + 1}. {q.question}</p>
                <ul className="ml-5 space-y-1">
                  {(q.options || []).map((option, j) => (
                    <li key={j} className={`${j === q.correctAnswer ? 'text-green-700 font-medium' : ''}`}>
                      {String.fromCharCode(97 + j)}) {option} {j === q.correctAnswer && '✓'}
                    </li>
                  ))}
                </ul>
                {q.explanation && (
                  <p className="text-sm text-gray-600 mt-1 italic">Explanation: {q.explanation}</p>
                )}
              </div>
            ))}
          </div>
        );

      case 'media':
        return (
          <div className="flex flex-col items-center">
            {section.type === 'image' ? (
              <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                {section.src ? (
                  <img 
                    src={section.src} 
                    alt={section.alt || 'Image'} 
                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                  />
                ) : (
                  <div className="p-8 text-gray-400 italic">Image preview (add src URL)</div>
                )}
              </div>
            ) : (
              <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                {section.src ? (
                  <div className="relative" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="aspect-w-16 aspect-h-9 bg-black flex items-center justify-center">
                      <svg className="w-12 h-12 text-white opacity-70" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-gray-400 italic">Video preview (add src URL)</div>
                )}
              </div>
            )}
            {section.caption && <p className="text-sm text-gray-500 text-center mt-2">{section.caption}</p>}
          </div>
        );

      case 'scenario':
        return (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            {section.title && <h3 className="text-lg font-medium mb-2">{section.title}</h3>}
            <div className="whitespace-pre-wrap">{section.content}</div>
          </div>
        );

      case 'interactiveCode':
        return (
          <div>
            {section.title && <h3 className="text-lg font-medium mb-2">{section.title}</h3>}
            {section.description && <p className="mb-3">{section.description}</p>}
            <div className="rounded-md overflow-hidden mb-3">
              <SyntaxHighlighter
                language={section.language || 'python'}
                style={tomorrow}
                showLineNumbers={true}
                wrapLines={true}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              >
                {section.starterCode || '# Enter your starter code here'}
              </SyntaxHighlighter>
            </div>
            <div className="flex justify-end">
              <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 opacity-50 cursor-not-allowed">
                Run Code (Preview)
              </button>
            </div>
          </div>
        );

      case 'exercise':
        return (
          <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
            <h3 className="font-medium text-purple-800 mb-2">{section.title || 'Exercise'}</h3>
            <div className="mb-4">
              <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">{section.difficulty || 'intermediate'}</span>
            </div>
            <div className="whitespace-pre-wrap mb-3">{section.instructions}</div>
            {section.starterCode && (
              <div className="rounded-md overflow-hidden">
                <SyntaxHighlighter
                  language={section.language || 'python'}
                  style={tomorrow}
                  showLineNumbers={true}
                  wrapLines={true}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {section.starterCode}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="p-4 bg-gray-100 rounded-md italic text-gray-600">
            Preview not available for this section type
          </div>
        );
    }
  };

  return (
    <div className="border border-gray-200 rounded-md mb-4 overflow-hidden">
      <div 
        className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full font-bold text-sm mr-2">
            {index + 1}
          </div>
          <span className="font-medium">{section.type.charAt(0).toUpperCase() + section.type.slice(1)}</span>
          <span className="ml-2 text-gray-500 text-sm">
            {section.title || section.caption || (section.content && section.content.substring(0, 30) + '...') || ''}
          </span>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp(index);
            }}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded"
            title="Move up"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown(index);
            }}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded"
            title="Move down"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
            className="p-1 text-red-500 hover:bg-red-100 rounded"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
          <svg
            className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
      
      {expanded && (
        <div className="border-t border-gray-200">
          <div className="p-4">
            {renderEditor()}
          </div>
          
          {/* Preview section */}
          <div className="border-t border-gray-200 bg-white">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <h4 className="font-medium text-gray-700">Preview</h4>
            </div>
            <div className="p-4">
              {renderPreview()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionEditor; 