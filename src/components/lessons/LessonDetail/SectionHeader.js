'use client';

import { motion } from 'framer-motion';

const SectionHeader = ({ title, level, icon = null, bgColor = "bg-[#F3F4F6]", borderColor = "border-[#3B82F6]" }) => {
  // Different styles based on heading level
  let className = '';
  let iconSize = 'w-5 h-5';
  
  switch(level) {
    case 1: // h1
      className = "text-2xl font-bold text-[#1F2937] mb-6 mt-8 border-b-2 pb-3 border-[#3B82F6]";
      iconSize = 'w-6 h-6';
      break;
    case 2: // h2
      className = `text-xl font-bold text-[#1F2937] mt-10 mb-5 ${bgColor} p-3 rounded-lg shadow-sm border-l-4 ${borderColor}`;
      iconSize = 'w-5 h-5';
      break;
    case 3: // h3
      className = "text-lg font-bold text-[#1F2937] mt-6 mb-4";
      iconSize = 'w-4 h-4';
      break;
    default:
      className = "text-lg font-bold text-[#1F2937] mb-4 mt-6";
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="flex items-center">
        {icon && (
          <span className={`mr-2 ${iconSize} text-[#3B82F6]`}>
            {icon}
          </span>
        )}
        <span>{title}</span>
      </div>
    </motion.div>
  );
};

export default SectionHeader; 