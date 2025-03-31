'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const QuizQuestion = ({ 
  question, 
  options, 
  correctAnswer, 
  explanation, 
  onAnswered 
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return; // Prevent changing answer
    
    setSelectedOption(index);
    const correct = index === correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (onAnswered) {
      onAnswered(correct);
    }
  };
  
  return (
    <div className="mb-8 last:mb-0">
      <div className="text-[var(--text-primary)] font-medium mb-3">
        <ReactMarkdown>
          {question}
        </ReactMarkdown>
      </div>
      
      <div className="space-y-2">
        {options.map((option, index) => (
          <div 
            key={index}
            onClick={() => handleOptionSelect(index)}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedOption === null
                ? 'border-[var(--border-light)] hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                : selectedOption === index
                  ? (isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20')
                  : index === correctAnswer && showExplanation
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-[var(--border-light)] opacity-70'
            }`}
          >
            <div className="flex items-start">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                selectedOption === null
                  ? 'bg-[var(--background-secondary)] text-[var(--text-secondary)]'
                  : selectedOption === index
                    ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                    : index === correctAnswer && showExplanation
                      ? 'bg-green-500 text-white'
                      : 'bg-[var(--background-secondary)] text-[var(--text-secondary)]'
              }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <div className="text-[var(--text-primary)]">
                <ReactMarkdown>
                  {option}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <AnimatePresence>
        {showExplanation && explanation && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md"
          >
            <h4 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-2">Explanation</h4>
            <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--text-primary)]">
              <ReactMarkdown>
                {explanation}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Quiz = ({ title, questions }) => {
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    if (answered === questions.length && answered > 0) {
      setCompleted(true);
    }
  }, [answered, questions.length]);
  
  const handleQuestionAnswered = (correct) => {
    if (correct) {
      setScore(score + 1);
    }
    setAnswered(answered + 1);
  };
  
  const getResultStyles = () => {
    // Background colors
    let bgColor = score === questions.length 
      ? '#ECFDF5' // Light green
      : score > questions.length / 2 
        ? '#EFF6FF' // Light blue
        : '#FFFBEB'; // Light yellow
        
    // Dark mode background colors
    let darkBgColor = score === questions.length 
      ? 'rgba(6, 78, 59, 0.3)' // Dark green
      : score > questions.length / 2 
        ? 'rgba(30, 58, 138, 0.3)' // Dark blue
        : 'rgba(146, 64, 14, 0.3)'; // Dark yellow
        
    // Border colors
    let borderColor = score === questions.length 
      ? '#10B981' // Green
      : score > questions.length / 2 
        ? '#3B82F6' // Blue
        : '#F59E0B'; // Yellow
        
    // Dark mode border colors
    let darkBorderColor = score === questions.length 
      ? '#059669' // Dark green
      : score > questions.length / 2 
        ? '#2563EB' // Dark blue
        : '#D97706'; // Dark yellow
        
    // Text colors
    let textColor = score === questions.length 
      ? '#10B981' // Green
      : score > questions.length / 2 
        ? '#3B82F6' // Blue
        : '#F59E0B'; // Yellow
        
    // Dark mode text colors
    let darkTextColor = score === questions.length 
      ? '#34D399' // Light green
      : score > questions.length / 2 
        ? '#60A5FA' // Light blue
        : '#FBBF24'; // Light yellow
        
    return {
      backgroundColor: 'var(--is-dark) ? ' + darkBgColor + ' : ' + bgColor,
      borderColor: 'var(--is-dark) ? ' + darkBorderColor + ' : ' + borderColor,
      color: 'var(--is-dark) ? ' + darkTextColor + ' : ' + textColor
    };
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--card-bg)] rounded-lg shadow-md p-6 mb-6 border-l-4 border-purple-500 dark:border-purple-400 border border-[var(--card-border)]"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">{title || 'Quiz'}</h3>
        <div className="text-sm text-[var(--text-secondary)]">
          {answered}/{questions.length} Questions
        </div>
      </div>
      
      {completed && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-6 p-4 rounded-md text-center ${
            score === questions.length 
              ? 'bg-green-50 border-green-500 dark:bg-green-900/30 dark:border-green-700' 
              : score > questions.length / 2 
                ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30 dark:border-blue-700'
                : 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/30 dark:border-yellow-700'
          } border`}
        >
          <div className={`text-xl font-bold mb-1 ${
            score === questions.length 
              ? 'text-green-600 dark:text-green-400'
              : score > questions.length / 2 
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-yellow-600 dark:text-yellow-400'
          }`}
          >
            {score === questions.length 
              ? 'Perfect Score!' 
              : score > questions.length / 2 
                ? 'Good Job!' 
                : 'Keep Practicing!'}
          </div>
          <div className="text-[var(--text-primary)]">
            You scored {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </div>
        </motion.div>
      )}
      
      <div className="space-y-6">
        {questions.map((question, index) => (
          <QuizQuestion
            key={index}
            question={question.question}
            options={question.options}
            correctAnswer={question.correctAnswer}
            explanation={question.explanation}
            onAnswered={handleQuestionAnswered}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Quiz; 