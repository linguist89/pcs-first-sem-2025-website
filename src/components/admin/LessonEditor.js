'use client';

import { useState, useEffect } from 'react';
import { validateLesson } from '@/utils/lessonSchema';
import StructuredEditor from './StructuredEditor';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import dynamic from 'next/dynamic';

// Dynamically import AceEditor with no SSR to avoid hydration issues
const AceEditor = dynamic(
  async () => {
    const ace = await import('react-ace');
    // Import modes
    await import('ace-builds/src-noconflict/mode-json');
    
    // Import themes
    await import('ace-builds/src-noconflict/theme-tomorrow_night');
    await import('ace-builds/src-noconflict/theme-github');
    
    // Import extensions
    await import('ace-builds/src-noconflict/ext-language_tools');
    return ace.default;
  },
  { ssr: false }
);

/**
 * Component for editing lesson JSON with both structured and raw modes
 */
const LessonEditor = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [editMode, setEditMode] = useState('structured');
  const [jsonText, setJsonText] = useState('');
  const [rawSelectedLesson, setRawSelectedLesson] = useState('');
  const [previewLesson, setPreviewLesson] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [validation, setValidation] = useState({ isValid: true, errors: [] });
  const [editorLoaded, setEditorLoaded] = useState(false);
  
  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  // Fetch available lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching lessons from API...");
        const response = await fetch('/api/lessons');
        
        if (!response.ok) {
          console.error(`API Error: ${response.status} ${response.statusText}`);
          throw new Error(`Failed to fetch lessons: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          console.log(`Successfully loaded ${data.length} lessons`);
          if (data.length > 0) {
            console.log("First lesson example:", JSON.stringify(data[0]).substring(0, 200) + "...");
          }
          setLessons(data);
        } else {
          console.error("API returned non-array data:", data);
          setMessage({ type: 'error', text: 'Received invalid lessons data' });
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
        setMessage({ type: 'error', text: 'Failed to load lessons: ' + error.message });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLessons();
  }, []);

  // Fetch lesson content when raw lesson is selected
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted
    
    const fetchRawLesson = async () => {
      if (!rawSelectedLesson || editMode !== 'raw') {
        return;
      }

      try {
        setIsLoading(true);
        console.log(`Raw editor - Fetching lesson ID: "${rawSelectedLesson}"`);
        const response = await fetch(`/api/lessons/${rawSelectedLesson}`);
        
        if (!isMounted) return; // Don't continue if component unmounted
        
        if (!response.ok) {
          console.error(`API error: ${response.status} ${response.statusText}`);
          throw new Error(`Failed to fetch lesson: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!isMounted) return; // Don't continue if component unmounted
        
        console.log("Raw editor - API response received");
        
        if (data.lesson && data.content) {
          const fullData = {
            ...data.lesson,
            content: data.content
          };
          
          console.log("Raw editor - Lesson loaded successfully:", fullData.title);
          if (isMounted) {
            setJsonText(JSON.stringify(fullData, null, 2));
          }
        } else {
          console.error("Raw editor - Invalid lesson data format:", data);
          if (isMounted) {
            setMessage({ 
              type: 'error', 
              text: 'Could not load lesson content - invalid format' 
            });
          }
        }
      } catch (error) {
        console.error('Raw editor - Error fetching lesson content:', error);
        if (isMounted) {
          setMessage({ 
            type: 'error', 
            text: 'Failed to load lesson content: ' + error.message 
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRawLesson();
    
    // Cleanup function to prevent state updates if unmounted
    return () => {
      isMounted = false;
    };
  }, [rawSelectedLesson, editMode]);
  
  // Load lesson for preview mode
  useEffect(() => {
    let isMounted = true;
    
    const fetchPreviewLesson = async () => {
      if (editMode !== 'preview' || !rawSelectedLesson) return;
      
      try {
        setIsLoading(true);
        console.log(`Preview mode - Fetching lesson ID: "${rawSelectedLesson}"`);
        const response = await fetch(`/api/lessons/${rawSelectedLesson}`);
        
        if (!isMounted) return;
        
        if (!response.ok) {
          console.error(`API error in preview: ${response.status} ${response.statusText}`);
          throw new Error(`Failed to fetch lesson: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!isMounted) return;
        
        if (data.lesson && data.content) {
          const fullData = {
            ...data.lesson,
            content: data.content
          };
          
          console.log("Preview mode - Lesson loaded successfully:", fullData.title);
          setPreviewLesson(fullData);
        } else {
          console.error("Preview mode - Invalid lesson data format:", data);
          setMessage({ 
            type: 'error', 
            text: 'Could not load lesson for preview - invalid format' 
          });
        }
      } catch (error) {
        console.error('Preview mode - Error fetching lesson:', error);
        setMessage({ 
          type: 'error', 
          text: 'Failed to load lesson for preview: ' + error.message 
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchPreviewLesson();
    
    return () => {
      isMounted = false;
    };
  }, [rawSelectedLesson, editMode]);
  
  // Handle selecting a lesson in raw mode
  const handleRawLessonSelect = (e) => {
    const lessonId = e.target.value;
    console.log("Raw mode - Selected lesson ID:", lessonId);
    setRawSelectedLesson(lessonId);
    setMessage({ type: '', text: '' });

    if (!lessonId) {
      setJsonText('');
    }
  };
  
  // Handle saving the structured edited lesson
  const handleStructuredSave = async (lessonData) => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/admin/update-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonData,
          format: lessonData.format || 'json'
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Lesson saved successfully!' });
        return true;
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save lesson.' });
        throw new Error(result.error || 'Failed to save lesson');
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
      setMessage({ type: 'error', text: 'Error saving lesson: ' + error.message });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Validate JSON as the user types in raw mode
  useEffect(() => {
    if (!jsonText || editMode !== 'raw') {
      setValidation({ isValid: true, errors: [] });
      return;
    }
    
    try {
      const parsed = JSON.parse(jsonText);
      const result = validateLesson(parsed);
      setValidation(result);
    } catch (error) {
      setValidation({ 
        isValid: false, 
        errors: ['Invalid JSON format: ' + error.message] 
      });
    }
  }, [jsonText, editMode]);
  
  // Handle saving in raw JSON mode
  const handleRawSave = async () => {
    try {
      setIsSaving(true);
      setMessage({ type: '', text: '' });
      
      if (!validation.isValid) {
        setMessage({ 
          type: 'error', 
          text: `Cannot save: ${validation.errors.join(', ')}` 
        });
        return;
      }
      
      const parsed = JSON.parse(jsonText);
      
      const response = await fetch('/api/admin/update-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonData: parsed,
          format: parsed.format || 'json'
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Lesson saved successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save lesson.' });
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
      setMessage({ type: 'error', text: 'Error saving lesson: ' + error.message });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex border border-gray-200 rounded-md overflow-hidden">
        <button
          onClick={() => setEditMode('structured')}
          className={`flex-1 py-2 px-4 ${
            editMode === 'structured' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Structured Editor
        </button>
        <button
          onClick={() => setEditMode('raw')}
          className={`flex-1 py-2 px-4 ${
            editMode === 'raw' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Raw JSON Editor
        </button>
        <button
          onClick={() => setEditMode('preview')}
          className={`flex-1 py-2 px-4 ${
            editMode === 'preview' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Lesson Preview
        </button>
      </div>
      
      {/* Display loading indicator while fetching initial lessons list */}
      {isLoading && lessons.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading lessons...</span>
        </div>
      )}
      
      {/* Show error if we couldn't load any lessons */}
      {!isLoading && lessons.length === 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
          <p className="text-red-700">No lessons found. Please check if lessons exist in the system.</p>
        </div>
      )}
      
      {/* Only show editor when lessons are loaded */}
      {lessons.length > 0 && (
        <>
          {editMode === 'structured' ? (
            <StructuredEditor 
              lessons={lessons}
              onSave={handleStructuredSave}
            />
          ) : editMode === 'raw' ? (
            <>
              <div>
                <label htmlFor="raw-lesson-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select a lesson to edit
                </label>
                <select
                  id="raw-lesson-select"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={rawSelectedLesson}
                  onChange={handleRawLessonSelect}
                  disabled={isLoading}
                >
                  <option value="">-- Select a lesson --</option>
                  {Array.isArray(lessons) && lessons.map((lesson) => (
                    <option key={lesson.uniqueId || `lesson-${lesson.id}`} value={lesson.id}>
                      {lesson.id}: {lesson.title} ({lesson.format})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="json-editor" className="block text-sm font-medium text-gray-700 mb-1">
                  Edit Lesson JSON
                </label>
                <div className={`border rounded-md shadow-sm overflow-hidden ${
                  validation.isValid ? 'border-gray-300' : 'border-red-300'
                }`}>
                  {editorLoaded ? (
                    <AceEditor
                      mode="json"
                      theme="tomorrow_night"
                      value={jsonText}
                      onChange={setJsonText}
                      name="json-editor"
                      width="100%"
                      height="70vh"
                      fontSize={14}
                      showPrintMargin={false}
                      showGutter={true}
                      highlightActiveLine={true}
                      readOnly={isLoading || isSaving}
                      setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: true,
                        tabSize: 2,
                        useWorker: false,
                      }}
                      style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                      }}
                    />
                  ) : (
                    <div className="flex h-[70vh]">
                      {/* Line numbers column */}
                      <div className="bg-gray-100 text-gray-500 text-xs font-mono p-2 text-right select-none border-r border-gray-200" style={{ width: '50px' }}>
                        {jsonText.split('\n').map((_, i) => (
                          <div key={i} className="leading-relaxed">{i + 1}</div>
                        ))}
                      </div>
                      
                      {/* JSON content - textarea */}
                      <textarea
                        id="json-editor"
                        value={jsonText}
                        onChange={(e) => setJsonText(e.target.value)}
                        disabled={isLoading || isSaving}
                        className="flex-1 p-2 font-mono text-sm resize-none focus:outline-none"
                        style={{
                          lineHeight: 1.5,
                          tabSize: 2,
                          overflowY: 'auto',
                          color: validation.isValid ? '#1f2937' : '#ef4444',
                        }}
                        spellCheck="false"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {!validation.isValid && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Validation errors:</h3>
                      <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                        {validation.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {message.text && (
                <div className={`${
                  message.type === 'error' 
                    ? 'bg-red-50 border-red-400 text-red-700' 
                    : 'bg-green-50 border-green-400 text-green-700'
                  } border-l-4 p-4`}>
                  <p>{message.text}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className={`px-4 py-2 text-white rounded-md ${
                    isSaving || !validation.isValid
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  onClick={handleRawSave}
                  disabled={isSaving || !validation.isValid}
                >
                  {isSaving ? 'Saving...' : 'Save Lesson'}
                </button>
              </div>
            </>
          ) : (
            // Preview Mode
            <div className="space-y-6">
              <div>
                <label htmlFor="preview-lesson-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select a lesson to preview
                </label>
                <select
                  id="preview-lesson-select"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={rawSelectedLesson}
                  onChange={handleRawLessonSelect}
                  disabled={isLoading}
                >
                  <option value="">-- Select a lesson --</option>
                  {Array.isArray(lessons) && lessons.map((lesson) => (
                    <option key={lesson.uniqueId || `lesson-${lesson.id}`} value={lesson.id}>
                      {lesson.id}: {lesson.title} ({lesson.format})
                    </option>
                  ))}
                </select>
              </div>
              
              {!rawSelectedLesson && (
                <div className="p-8 bg-gray-50 rounded-md text-center">
                  <p className="text-gray-500">Please select a lesson to preview</p>
                </div>
              )}
              
              {rawSelectedLesson && isLoading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2">Loading lesson preview...</span>
                </div>
              )}
              
              {rawSelectedLesson && !isLoading && previewLesson && (
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-green-50 p-3 border-b border-gray-200">
                    <h3 className="font-medium text-green-800">Preview Mode - This is how your lesson will look to students</h3>
                  </div>
                  
                  <div className="p-6 max-w-4xl mx-auto">
                    {/* Lesson header */}
                    <div className="mb-10">
                      <h1 className="text-3xl font-bold mb-3">{previewLesson.title}</h1>
                      {previewLesson.description && (
                        <p className="text-gray-600 mb-4">{previewLesson.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {previewLesson.topics && previewLesson.topics.map((topic, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                            {topic}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {previewLesson.duration || '30 minutes'}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                          </svg>
                          {previewLesson.difficulty || 'Intermediate'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Lesson content sections */}
                    <div className="space-y-8">
                      {previewLesson.content && previewLesson.content.map((section, index) => {
                        return (
                          <div key={index} className="lesson-section">
                            {(() => {
                              switch (section.type) {
                                case 'text':
                                  return (
                                    <div className="prose max-w-none">
                                      {section.title && <h3 className="text-xl font-medium mb-3">{section.title}</h3>}
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
                                          {section.content || '# No code content'}
                                        </SyntaxHighlighter>
                                      </div>
                                    </div>
                                  );
                                  
                                case 'quiz':
                                  return (
                                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                      <h3 className="font-medium text-blue-800 mb-3">{section.title || 'Quiz'}</h3>
                                      {(section.questions || []).map((q, i) => (
                                        <div key={i} className="mb-6 last:mb-0">
                                          <p className="font-medium mb-2">{i + 1}. {q.question}</p>
                                          <ul className="ml-5 space-y-2">
                                            {(q.options || []).map((option, j) => (
                                              <li key={j} className="flex items-start">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 mr-2 flex-shrink-0 mt-0.5">
                                                  {String.fromCharCode(97 + j)}
                                                </div>
                                                <span>{option}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                  
                                case 'media':
                                  return (
                                    <div className="flex flex-col items-center">
                                      {section.mediaType === 'image' ? (
                                        <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                                          {section.src ? (
                                            <img 
                                              src={section.src} 
                                              alt={section.alt || 'Image'} 
                                              style={{ maxWidth: '100%', maxHeight: '450px' }}
                                            />
                                          ) : (
                                            <div className="p-12 text-gray-400 italic">Image (Missing source URL)</div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                                          {section.src ? (
                                            <div className="relative" style={{ width: '100%', maxWidth: '600px' }}>
                                              <div className="aspect-w-16 aspect-h-9 bg-black flex items-center justify-center">
                                                <svg className="w-16 h-16 text-white opacity-70" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                                                </svg>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="p-12 text-gray-400 italic">Video (Missing source URL)</div>
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
                                      {section.highlightedContent && (
                                        <div className="mt-4 p-3 bg-white rounded">{section.highlightedContent}</div>
                                      )}
                                      {section.objective && (
                                        <div className="mt-4 font-medium">Objective: {section.objective}</div>
                                      )}
                                    </div>
                                  );
                                  
                                case 'interactiveCode':
                                  return (
                                    <div className="border border-blue-200 rounded-md overflow-hidden">
                                      <div className="bg-blue-50 p-3 border-b border-blue-200">
                                        {section.title && <h3 className="font-medium text-blue-800">{section.title}</h3>}
                                        {section.description && <p className="text-sm mt-1">{section.description}</p>}
                                      </div>
                                      <div className="p-4 bg-white">
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
                                            {section.starterCode || '# No starter code'}
                                          </SyntaxHighlighter>
                                        </div>
                                        <div className="flex justify-end">
                                          <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                                            Run Code
                                          </button>
                                        </div>
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
                                      Preview not available for section type: {section.type}
                                    </div>
                                  );
                              }
                            })()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {/* Display loading indicator when processing actions */}
      {isLoading && lessons.length > 0 && editMode !== 'preview' && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default LessonEditor; 