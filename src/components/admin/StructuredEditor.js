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
      { id: 'text', label: 'Text', icon: 'M4 6h16M4 12h16M4 18h7', category: 'basic' },
      { id: 'code', label: 'Code', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', category: 'code' },
      { id: 'quiz', label: 'Quiz', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', category: 'interactive' },
      { id: 'media', label: 'Media', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', category: 'basic' },
      { id: 'scenario', label: 'Scenario', icon: 'M13 10V3L4 14h7v7l9-11h-7z', category: 'interactive' },
      { id: 'interactiveCode', label: 'Interactive Code', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', category: 'code' },
      { id: 'exercise', label: 'Exercise', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', category: 'interactive' },
    ];
    
    // Group by category
    const categories = {
      basic: { name: 'Basic Content', items: [] },
      code: { name: 'Code Content', items: [] },
      interactive: { name: 'Interactive Content', items: [] }
    };
    
    sectionTypes.forEach(type => {
      if (categories[type.category]) {
        categories[type.category].items.push(type);
      }
    });
    
    return (
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Add New Section</h3>
        
        {Object.values(categories).map(category => (
          <div key={category.name} className="mb-4 last:mb-0">
            <h4 className="text-sm font-medium text-gray-700 mb-2">{category.name}</h4>
            <div className="flex flex-wrap gap-2">
              {category.items.map(type => {
                // Determine button color based on category
                const buttonColors = {
                  basic: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
                  code: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
                  interactive: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                };
                
                const colorClass = buttonColors[type.category] || 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200';
                
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleAddSection(type.id)}
                    className={`px-3 py-2 border rounded-md ${colorClass} flex items-center shadow-sm hover:shadow transition-all duration-150`}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={type.icon}></path>
                    </svg>
                    <span className="whitespace-nowrap">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="bg-blue-50 border-b border-blue-100 p-4">
              <h3 className="text-lg font-medium text-blue-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Lesson Information
              </h3>
            </div>
            <div className="p-5">
              <div className="space-y-4">
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
                    placeholder="e.g. Introduction to Python Variables"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
                      Lesson ID
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        ID:
                      </span>
                      <input
                        type="text"
                        id="id"
                        className="block w-full rounded-none rounded-r-md px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={lessonData.id || ''}
                        onChange={(e) => handleMetadataChange('id', e.target.value)}
                        placeholder="e.g. python-101"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="duration"
                        className="block w-full rounded-none rounded-r-md px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={lessonData.duration || ''}
                        onChange={(e) => handleMetadataChange('duration', e.target.value)}
                        placeholder="e.g. 30 minutes"
                      />
                    </div>
                  </div>
                  
                  <div>
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
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={lessonData.description || ''}
                    onChange={(e) => handleMetadataChange('description', e.target.value)}
                    placeholder="Brief description of what students will learn in this lesson..."
                  />
                </div>
                
                <div>
                  <label htmlFor="topics" className="block text-sm font-medium text-gray-700 mb-1">
                    Topics (comma separated)
                  </label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="topics"
                      className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={(lessonData.topics || []).join(', ')}
                      onChange={(e) => handleMetadataChange('topics', e.target.value.split(',').map(t => t.trim()))}
                      placeholder="e.g. Python, Variables, Functions"
                    />
                    {lessonData.topics && lessonData.topics.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {lessonData.topics.map((topic, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
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
          </div>
          
          {/* Content sections */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                Lesson Content
              </h3>
              <div className="text-sm text-gray-500">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">{lessonData.content ? lessonData.content.length : 0} sections</span>
              </div>
            </div>
            
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
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Please fix these validation errors:</h3>
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
              } border-l-4 p-4 mb-6`}>
              <p>{message.text}</p>
            </div>
          )}
          
          {/* Save button */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Save your changes before leaving this page.
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className={`px-4 py-2 text-white rounded-md flex items-center ${
                    isSaving || errors.length > 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  onClick={handleSave}
                  disabled={isSaving || errors.length > 0}
                >
                  {isSaving ? (
                    <><span className="mr-2">Saving...</span><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div></>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                      </svg>
                      Save Lesson
                    </>
                  )}
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
            </div>
          </div>
          
          {/* Full lesson preview */}
          <div className="mt-8 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-green-50 p-4 border-b border-green-100 flex justify-between items-center">
              <h3 className="font-medium text-green-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Full Lesson Preview
              </h3>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer mr-3">
                  <div className="relative">
                    <input 
                      type="checkbox"
                      className="sr-only"
                      checked={autoUpdatePreview}
                      onChange={() => setAutoUpdatePreview(!autoUpdatePreview)}
                    />
                    <div className={`block w-10 h-6 rounded-full ${autoUpdatePreview ? 'bg-green-400' : 'bg-gray-300'} transition`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${autoUpdatePreview ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <span className="ml-2 text-sm text-green-700">Auto-Update Preview</span>
                </label>
              </div>
            </div>
            
            <div id="fullPreview" className="p-0 max-w-4xl mx-auto">
              {/* Lesson header - use the student-facing styling */}
              <div className="bg-white p-6 border-b border-gray-200">
                <div className="mb-2 text-gray-500 flex items-center">
                  <span className="mr-2">Lesson {lessonData.id}</span>
                  {lessonData.difficulty && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lessonData.difficulty === 'beginner' 
                        ? 'bg-green-100 text-green-800' 
                        : lessonData.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {lessonData.difficulty.charAt(0).toUpperCase() + lessonData.difficulty.slice(1)}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold mb-3 text-gray-900">{lessonData.title}</h1>
                {lessonData.description && (
                  <p className="text-gray-600 mb-4">{lessonData.description}</p>
                )}
                {lessonData.topics && lessonData.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {lessonData.topics.map((topic, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
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
              
              {/* Lesson content sections using actual components */}
              <div className="bg-gray-50 p-6">
                {/* Import the student-facing components */}
                {lessonData.content && lessonData.content.map((section, index) => {
                  return (
                    <div key={index} className="lesson-section mb-6">
                      {(() => {
                        switch (section.type) {
                          case 'text':
                            return (
                              <div className="bg-white rounded-lg shadow-md p-6">
                                {section.title && <h3 className="text-xl font-bold text-gray-800 mb-4">{section.title}</h3>}
                                <div className="prose prose-sm max-w-none text-gray-700">
                                  <div className="whitespace-pre-wrap">{section.content}</div>
                                </div>
                              </div>
                            );
                            
                          case 'code':
                            return (
                              <div className="relative mb-6">
                                <div className="bg-gray-900 rounded-t-lg py-2 px-4 flex justify-between items-center">
                                  <div className="text-gray-400 text-sm font-mono">
                                    {section.language || 'python'}
                                  </div>
                                  <button className="text-gray-400 hover:text-white text-sm flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy
                                  </button>
                                </div>
                                <SyntaxHighlighter
                                  language={section.language || 'python'}
                                  style={tomorrow}
                                  showLineNumbers={section.showLineNumbers}
                                  className="rounded-b-lg !mt-0"
                                  customStyle={{
                                    margin: 0,
                                    padding: '1rem',
                                    fontSize: '0.95rem',
                                    backgroundColor: '#1E293B'
                                  }}
                                >
                                  {section.content || '# No code content'}
                                </SyntaxHighlighter>
                                {section.caption && (
                                  <div className="text-sm text-gray-600 italic mt-2 px-1">
                                    {section.caption}
                                  </div>
                                )}
                              </div>
                            );
                            
                          case 'quiz':
                            return (
                              <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-purple-500">
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-xl font-bold text-gray-800">{section.title || 'Quiz'}</h3>
                                  <div className="text-sm text-gray-600">
                                    {section.questions ? section.questions.length : 0} Questions
                                  </div>
                                </div>
                                
                                <div className="space-y-6">
                                  {(section.questions || []).map((question, qIndex) => (
                                    <div key={qIndex} className="mb-8 last:mb-0">
                                      <div className="text-gray-800 font-medium mb-3">
                                        {question.question}
                                      </div>
                                      
                                      <div className="space-y-2">
                                        {(question.options || []).map((option, oIndex) => (
                                          <div 
                                            key={oIndex}
                                            className="p-3 border rounded-md cursor-pointer transition-colors border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                          >
                                            <div className="flex items-start">
                                              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 bg-gray-100 text-gray-600">
                                                {String.fromCharCode(65 + oIndex)}
                                              </div>
                                              <div className="text-gray-700">
                                                {option}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                            
                          case 'media':
                            return (
                              <div className="mb-6">
                                <div className="relative rounded-lg overflow-hidden">
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
                                        <video
                                          src={section.src}
                                          controls
                                          className="w-full rounded-lg"
                                        >
                                          Your browser does not support the video tag.
                                        </video>
                                      ) : (
                                        <div className="p-12 text-gray-400 italic">Video (Missing source URL)</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {section.caption && (
                                  <div className="text-sm text-gray-600 italic mt-2 px-1">
                                    {section.caption}
                                  </div>
                                )}
                              </div>
                            );
                            
                          case 'scenario':
                            return (
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                                <div className="flex items-center mb-4">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-800">{section.title || 'Scenario'}</h3>
                                </div>
                                
                                <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                                  <div className="whitespace-pre-wrap">{section.content}</div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mt-4">
                                  {section.highlightedContent && (
                                    <button className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200">
                                      Show Highlighted Parts
                                    </button>
                                  )}
                                  
                                  {section.objective && (
                                    <button className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-green-100 text-green-700 hover:bg-green-200">
                                      Show Objective
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                            
                          case 'interactiveCode':
                            return (
                              <div className="mb-8">
                                {section.title && (
                                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{section.title}</h3>
                                )}
                                
                                {section.description && (
                                  <div className="text-gray-700 mb-3">
                                    {section.description}
                                  </div>
                                )}

                                <div className="relative border border-gray-200 rounded-lg overflow-hidden">
                                  <div className="bg-gray-900 py-2 px-4 flex justify-between items-center">
                                    <div className="text-gray-400 text-sm font-mono">
                                      {section.language || 'python'}
                                    </div>
                                    <div className="flex space-x-2">
                                      <button className="text-gray-400 hover:text-white text-sm flex items-center px-2 py-1 rounded hover:bg-gray-800" title="Copy code">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy
                                      </button>
                                      <button className="text-gray-400 hover:text-white text-sm flex items-center px-2 py-1 rounded hover:bg-gray-800" title="Edit code">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit
                                      </button>
                                    </div>
                                  </div>

                                  <SyntaxHighlighter
                                    language={section.language || 'python'}
                                    style={tomorrow}
                                    showLineNumbers={true}
                                    className="rounded-b-lg !mt-0"
                                    customStyle={{
                                      margin: 0,
                                      padding: '1rem',
                                      fontSize: '0.95rem',
                                      backgroundColor: '#1E293B'
                                    }}
                                  >
                                    {section.starterCode || '# Enter your code here'}
                                  </SyntaxHighlighter>
                                </div>

                                {section.instructions && (
                                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-md p-3">
                                    <div className="font-medium text-blue-800 mb-1">Instructions</div>
                                    <div className="text-blue-700 text-sm">
                                      {section.instructions}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                            
                          case 'exercise':
                            return (
                              <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-xl font-bold text-gray-800">{section.title || 'Exercise'}</h3>
                                  <span className={`bg-${section.difficulty === 'beginner' ? 'green' : section.difficulty === 'intermediate' ? 'yellow' : 'red'}-100 text-${section.difficulty === 'beginner' ? 'green' : section.difficulty === 'intermediate' ? 'yellow' : 'red'}-800 text-sm rounded-full px-3 py-1 font-medium border border-${section.difficulty === 'beginner' ? 'green' : section.difficulty === 'intermediate' ? 'yellow' : 'red'}-200`}>
                                    {section.difficulty ? section.difficulty.charAt(0).toUpperCase() + section.difficulty.slice(1) : 'Intermediate'}
                                  </span>
                                </div>
                                
                                <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                                  <div className="whitespace-pre-wrap">{section.instructions}</div>
                                </div>
                                
                                {section.starterCode && (
                                  <div className="mb-6">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Starter Code:</div>
                                    <SyntaxHighlighter
                                      language={section.language || 'python'}
                                      style={tomorrow}
                                      className="rounded-lg"
                                      customStyle={{
                                        padding: '1rem',
                                        fontSize: '0.95rem',
                                        backgroundColor: '#1E293B'
                                      }}
                                    >
                                      {section.starterCode}
                                    </SyntaxHighlighter>
                                  </div>
                                )}
                                
                                {section.solution && (
                                  <div className="mt-6">
                                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                      Show Solution
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                            
                          default:
                            return (
                              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-6">
                                <p className="text-yellow-700">
                                  Unknown content type: {section.type}
                                </p>
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