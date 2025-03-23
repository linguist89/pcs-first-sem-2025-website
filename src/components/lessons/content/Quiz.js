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
      <div className="text-gray-800 font-medium mb-3">
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
                ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                : selectedOption === index
                  ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
                  : index === correctAnswer && showExplanation
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 opacity-70'
            }`}
          >
            <div className="flex items-start">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                selectedOption === null
                  ? 'bg-gray-100 text-gray-600'
                  : selectedOption === index
                    ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                    : index === correctAnswer && showExplanation
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
              }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <div className="text-gray-700">
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
            className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md"
          >
            <h4 className="text-md font-medium text-blue-800 mb-2">Explanation</h4>
            <div className="prose prose-sm max-w-none text-gray-700">
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
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-purple-500"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title || 'Quiz'}</h3>
        <div className="text-sm text-gray-600">
          {answered}/{questions.length} Questions
        </div>
      </div>
      
      {completed && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 rounded-md text-center"
          style={{ 
            backgroundColor: score === questions.length 
              ? '#ECFDF5' // Light green
              : score > questions.length / 2 
                ? '#EFF6FF' // Light blue
                : '#FFFBEB', // Light yellow
            borderColor: score === questions.length 
              ? '#10B981' // Green
              : score > questions.length / 2 
                ? '#3B82F6' // Blue
                : '#F59E0B', // Yellow
            borderWidth: '1px'
          }}
        >
          <div className="text-xl font-bold mb-1"
            style={{ 
              color: score === questions.length 
                ? '#10B981' // Green
                : score > questions.length / 2 
                  ? '#3B82F6' // Blue
                  : '#F59E0B' // Yellow
            }}
          >
            {score === questions.length 
              ? 'Perfect Score!' 
              : score > questions.length / 2 
                ? 'Good Job!' 
                : 'Keep Practicing!'}
          </div>
          <div className="text-gray-700">
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