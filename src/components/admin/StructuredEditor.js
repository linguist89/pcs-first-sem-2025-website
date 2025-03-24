'use client';

import { useState, useEffect } from 'react';
import SectionEditor from './SectionEditor';
import { validateLesson } from '@/utils/lessonSchema';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Component for structured editing of lesson content
 */
const StructuredEditor = ({ lessons, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState('');
  const [lessonData, setLessonData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isExpanded, setIsExpanded] = useState({});
  const [autoUpdatePreview, setAutoUpdatePreview] = useState(false);
  
  // Track if component is mounted
  const [isMounted, setIsMounted] = useState(true);
  
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);
  
  // Validate each section and collect error messages
  useEffect(() => {
    if (!lessonData) return;
    
    const newErrors = [];
    
    // Check required metadata fields
    if (!lessonData.id) newErrors.push('Lesson ID is required');
    if (!lessonData.title) newErrors.push('Lesson title is required');
    
    // Check each section for required fields based on type
    (lessonData.content || []).forEach((section, index) => {
      if (!section.type) {
        newErrors.push(`Section ${index + 1}: Section type is required`);
        return;
      }
      
      switch (section.type) {
        case 'text':
          if (!section.content) newErrors.push(`Section ${index + 1} (Text): Content is required`);
          break;
        case 'code':
          if (!section.content) newErrors.push(`Section ${index + 1} (Code): Code content is required`);
          break;
        case 'quiz':
          if (!section.questions || section.questions.length === 0) 
            newErrors.push(`Section ${index + 1} (Quiz): At least one question is required`);
          else {
            section.questions.forEach((q, qIndex) => {
              if (!q.question) newErrors.push(`Section ${index + 1} (Quiz): Question ${qIndex + 1} text is required`);
              if (!q.options || q.options.length < 2) 
                newErrors.push(`Section ${index + 1} (Quiz): Question ${qIndex + 1} needs at least 2 options`);
              if (q.correctOptionIndex === undefined || q.correctOptionIndex < 0 || q.correctOptionIndex >= (q.options?.length || 0)) 
                newErrors.push(`Section ${index + 1} (Quiz): Question ${qIndex + 1} correct answer is invalid`);
            });
          }
          break;
        case 'media':
          if (!section.src) newErrors.push(`Section ${index + 1} (Media): Source URL is required`);
          if (!section.mediaType) newErrors.push(`Section ${index + 1} (Media): Media type is required`);
          break;
        // Add validation for other section types as needed
      }
    });
    
    setErrors(newErrors);
    
    // Auto-update the preview when changes are made and auto-update is enabled
    if (autoUpdatePreview) {
      // Use a debounce to prevent too frequent updates
      const timeoutId = setTimeout(() => {
        // Update the preview by forcing a re-render of the preview section
        const previewSection = document.getElementById('fullPreview');
        if (previewSection) {
          // Apply a subtle flash effect to indicate the preview was updated
          previewSection.classList.add('bg-green-50');
          setTimeout(() => {
            previewSection.classList.remove('bg-green-50');
          }, 300);
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [lessonData, autoUpdatePreview]);
  
  // Fetch lesson content when selected
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted
    
    const fetchLessonContent = async () => {
      if (!selectedLesson) {
        setLessonData(null);
        return;
      }
      
      try {
        setIsLoading(true);
        console.log(`Fetching lesson with ID: "${selectedLesson}"`);
        const response = await fetch(`/api/lessons/${selectedLesson}`);
        
        if (!isMounted) return; // Don't continue if component unmounted
        
        if (!response.ok) {
          console.error(`API error: ${response.status} ${response.statusText}`);
          throw new Error(`Failed to fetch lesson: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!isMounted) return; // Don't continue if component unmounted
        
        console.log("API response received:", data);
        
        if (data.lesson && data.content) {
          const fullData = {
            ...data.lesson,
            content: data.content
          };
          
          console.log("Lesson data loaded successfully:", fullData.title);
          if (isMounted) {
            setLessonData(fullData);
            validateLessonData(fullData);
          }
        } else {
          console.error("Invalid lesson data format:", data);
          if (isMounted) {
            setMessage({ 
              type: 'error', 
              text: 'Could not load lesson content - invalid format' 
            });
          }
        }
      } catch (error) {
        console.error('Error fetching lesson content:', error);
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
    
    fetchLessonContent();
    
    // Cleanup function to prevent state updates if unmounted
    return () => {
      isMounted = false;
    };
  }, [selectedLesson]);
  
  // Validate lesson data
  const validateLessonData = (data) => {
    const result = validateLesson(data);
    setErrors(result.errors);
  };
  
  // Handle selecting a lesson
  const handleLessonSelect = (e) => {
    const lessonId = e.target.value;
    console.log("Selected lesson ID:", lessonId);
    setSelectedLesson(lessonId);
    setMessage({ type: '', text: '' });
  };
  
  // Handle metadata fields change
  const handleMetadataChange = (field, value) => {
    const updatedLessonData = { ...lessonData, [field]: value };
    setLessonData(updatedLessonData);
    validateLessonData(updatedLessonData);
  };
  
  // Handle section change
  const handleSectionChange = (index, updatedSection) => {
    const updatedContent = [...lessonData.content];
    updatedContent[index] = updatedSection;
    
    const updatedLessonData = { ...lessonData, content: updatedContent };
    setLessonData(updatedLessonData);
    validateLessonData(updatedLessonData);
  };
  
  // Handle section removal
  const handleRemoveSection = (index) => {
    const updatedContent = [...lessonData.content];
    updatedContent.splice(index, 1);
    
    const updatedLessonData = { ...lessonData, content: updatedContent };
    setLessonData(updatedLessonData);
    validateLessonData(updatedLessonData);
  };
  
  // Handle moving a section up in order
  const handleMoveUp = (index) => {
    if (index <= 0) return; // Can't move up the first item
    
    const updatedContent = [...lessonData.content];
    // Swap current item with the one above it
    [updatedContent[index], updatedContent[index - 1]] = [updatedContent[index - 1], updatedContent[index]];
    
    const updatedLessonData = { ...lessonData, content: updatedContent };
    setLessonData(updatedLessonData);
    validateLessonData(updatedLessonData);
  };
  
  // Handle moving a section down in order
  const handleMoveDown = (index) => {
    if (index >= lessonData.content.length - 1) return; // Can't move down the last item
    
    const updatedContent = [...lessonData.content];
    // Swap current item with the one below it
    [updatedContent[index], updatedContent[index + 1]] = [updatedContent[index + 1], updatedContent[index]];
    
    const updatedLessonData = { ...lessonData, content: updatedContent };
    setLessonData(updatedLessonData);
    validateLessonData(updatedLessonData);
  };
  
  // Handle adding a new section
  const handleAddSection = (type) => {
    let newSection = { type };
    
    // Add required fields based on type
    switch (type) {
      case 'text':
        newSection.title = '';
        newSection.content = '';
        break;
      case 'code':
        newSection.language = 'python';
        newSection.content = '';
        newSection.showLineNumbers = true;
        break;
      case 'quiz':
        newSection.title = 'New Quiz';
        newSection.questions = [{
          question: 'New question',
          options: ['Option 1', 'Option 2', 'Option 3'],
          correctAnswer: 0
        }];
        break;
      case 'media':
        newSection.src = '';
        newSection.alt = '';
        newSection.type = 'image';
        break;
      case 'scenario':
        newSection.title = '';
        newSection.content = '';
        break;
      case 'interactiveCode':
        newSection.title = '';
        newSection.description = '';
        newSection.starterCode = '';
        newSection.language = 'python';
        break;
      case 'exercise':
        newSection.title = '';
        newSection.instructions = '';
        newSection.difficulty = 'intermediate';
        break;
    }
    
    const updatedContent = [...lessonData.content, newSection];
    const updatedLessonData = { ...lessonData, content: updatedContent };
    
    setLessonData(updatedLessonData);
    validateLessonData(updatedLessonData);
  };
  
  // Handle saving the lesson
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage({ type: '', text: '' });
      
      if (errors.length > 0) {
        setMessage({
          type: 'error',
          text: `Cannot save: Please fix validation errors first.`
        });
        return;
      }
      
      await onSave(lessonData);
      setMessage({ type: 'success', text: 'Lesson saved successfully!' });
    } catch (error) {
      console.error('Error saving lesson:', error);
      setMessage({ type: 'error', text: 'Error saving lesson: ' + error.message });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Render available section types to add
  const renderSectionTypes = () => {
    const sectionTypes = [
      { id: 'text', label: 'Text' },
      { id: 'code', label: 'Code' },
      { id: 'quiz', label: 'Quiz' },
      { id: 'media', label: 'Media' },
      { id: 'scenario', label: 'Scenario' },
      { id: 'interactiveCode', label: 'Interactive Code' },
      { id: 'exercise', label: 'Exercise' },
    ];
    
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add New Section
        </label>
        <div className="flex flex-wrap gap-2">
          {sectionTypes.map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleAddSection(type.id)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + {type.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  console.log("Available lessons:", lessons);
  console.log("Current selected lesson:", selectedLesson);
  console.log("Current lesson data:", lessonData);
  
  // Make sure we have valid lessons data
  const validLessons = Array.isArray(lessons) ? lessons : [];
  
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="structured-lesson-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select a lesson to edit
        </label>
        
        {/* Dropdown fix - replace with individual button for each lesson */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-2">
            {validLessons.map((lesson) => (
              <button
                key={lesson.uniqueId || `lesson-${lesson.id}`}
                type="button"
                onClick={() => {
                  console.log("Clicked lesson button:", lesson.id);
                  setSelectedLesson(lesson.id);
                }}
                className={`px-3 py-2 border rounded-md ${
                  selectedLesson === lesson.id 
                    ? 'bg-blue-100 border-blue-500 text-blue-700' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                {lesson.id}: {lesson.title}
              </button>
            ))}
          </div>
          
          {validLessons.length === 0 && (
            <div className="text-red-500">No lessons available. Please add lessons to the system.</div>
          )}
        </div>
        
        {/* Show debugging info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mb-4">
          Debug: Lessons count: {validLessons.length} | isLoading: {isLoading.toString()} | 
          isSaving: {isSaving.toString()} | selectedLesson: {selectedLesson || 'none'}
        </div>
      </div>
      
      {isLoading && selectedLesson && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {!isLoading && lessonData && (
        <div className="space-y-6">
          {/* Lesson metadata */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-2">Lesson Metadata</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={lessonData.title || ''}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
                    ID
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="id"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={lessonData.id || ''}
                      onChange={(e) => handleMetadataChange('id', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    id="duration"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={lessonData.duration || ''}
                    onChange={(e) => handleMetadataChange('duration', e.target.value)}
                    placeholder="e.g. 30 minutes"
                  />
                </div>
                
                <div className="flex-1">
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={lessonData.difficulty || ''}
                    onChange={(e) => handleMetadataChange('difficulty', e.target.value)}
                  >
                    <option value="">Select difficulty</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={2}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={lessonData.description || ''}
                  onChange={(e) => handleMetadataChange('description', e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="topics" className="block text-sm font-medium text-gray-700 mb-1">
                  Topics (comma separated)
                </label>
                <input
                  type="text"
                  id="topics"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={(lessonData.topics || []).join(', ')}
                  onChange={(e) => handleMetadataChange('topics', e.target.value.split(',').map(t => t.trim()))}
                  placeholder="e.g. Python, Variables, Functions"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => document.getElementById('fullPreview').scrollIntoView({ behavior: 'smooth' })}
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 mr-2 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Preview Lesson
                </button>
              </div>
            </div>
          </div>
          
          {/* Content sections */}
          <div>
            <h3 className="text-lg font-medium mb-2">Lesson Content</h3>
            <p className="text-sm text-gray-600 mb-4">
              Sections appear in the order shown below. Use the up/down arrows to change section order.
            </p>
            
            {lessonData.content && lessonData.content.map((section, index) => (
              <SectionEditor
                key={index}
                section={section}
                index={index}
                onChange={handleSectionChange}
                onRemove={handleRemoveSection}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
              />
            ))}
            
            {/* Add new section buttons */}
            {renderSectionTypes()}
          </div>
          
          {/* Validation errors */}
          {errors.length > 0 && (
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
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Status message */}
          {message.text && (
            <div className={`${
              message.type === 'error' 
                ? 'bg-red-50 border-red-400 text-red-700' 
                : 'bg-green-50 border-green-400 text-green-700'
              } border-l-4 p-4`}>
              <p>{message.text}</p>
            </div>
          )}
          
          {/* Save button */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className={`px-4 py-2 text-white rounded-md ${
                isSaving || errors.length > 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={handleSave}
              disabled={isSaving || errors.length > 0}
            >
              {isSaving ? 'Saving...' : 'Save Lesson'}
            </button>
            
            <button
              type="button"
              className={`px-4 py-2 text-white rounded-md flex items-center ${
                isSaving || errors.length > 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              onClick={async () => {
                const saved = await handleSave();
                if (saved) {
                  document.getElementById('fullPreview').scrollIntoView({ behavior: 'smooth' });
                }
              }}
              disabled={isSaving || errors.length > 0}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              Save & Preview
            </button>
          </div>
          
          {/* Full lesson preview */}
          <div className="mt-8 border border-gray-200 rounded-md overflow-hidden">
            <div className="bg-green-50 p-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-gray-800">Full Lesson Preview</h3>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer mr-3">
                  <div className="relative">
                    <input 
                      type="checkbox"
                      className="sr-only"
                      checked={autoUpdatePreview}
                      onChange={() => setAutoUpdatePreview(!autoUpdatePreview)}
                    />
                    <div className={`block w-10 h-6 rounded-full ${autoUpdatePreview ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${autoUpdatePreview ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">Auto-Update Preview</span>
                </label>
                <button 
                  type="button"
                  onClick={() => document.getElementById('fullPreview').scrollIntoView({ behavior: 'smooth' })}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Scroll to preview
                </button>
              </div>
            </div>
            
            <div id="fullPreview" className="p-6 max-w-4xl mx-auto">
              {/* Lesson header */}
              <div className="mb-10">
                <h1 className="text-3xl font-bold mb-3">{lessonData.title}</h1>
                {lessonData.description && (
                  <p className="text-gray-600 mb-4">{lessonData.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {lessonData.topics && lessonData.topics.map((topic, i) => (
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
                    {lessonData.duration || '30 minutes'}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    {lessonData.difficulty || 'Intermediate'}
                  </div>
                </div>
              </div>
              
              {/* Lesson content sections */}
              <div className="space-y-8">
                {lessonData.content && lessonData.content.map((section, index) => {
                  // Import the renderPreview function from SectionEditor
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
                                {section.type === 'image' ? (
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
        </div>
      )}
    </div>
  );
};

export default StructuredEditor; 