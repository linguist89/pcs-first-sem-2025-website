'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';

const SidebarContent = ({ sections, activeIndex, onSectionClick }) => {
  // Function to determine if a section is an H1 (main section) or H2/H3 (subsection)
  const isSectionMainHeader = (section) => {
    return section.level === 1;
  };

  // Group sections into an array of { main, subsections }
  const groupedSections = sections.reduce((acc, section, index) => {
    if (isSectionMainHeader(section)) {
      // Start a new group for main sections
      acc.push({
        main: section,
        mainIndex: index,
        subsections: []
      });
    } else if (acc.length > 0) {
      // Add subsection to the last main section
      acc[acc.length - 1].subsections.push({
        section,
        index
      });
    }
    return acc;
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.nav 
      className="sidebar-content mt-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {groupedSections.map((group, groupIndex) => (
        <Fragment key={`group-${groupIndex}`}>
          {/* Main section (usually H1) */}
          <motion.button
            variants={item}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left py-2 px-3 rounded-md mb-2 font-medium transition-colors flex items-center ${
              activeIndex === group.mainIndex
                ? 'bg-[#3B82F6] text-white'
                : 'hover:bg-gray-100 text-[#1F2937]'
            }`}
            onClick={() => onSectionClick(group.mainIndex)}
          >
            <span className="truncate">{group.main.title}</span>
          </motion.button>

          {/* Subsections (H2 and H3) */}
          <motion.div 
            variants={item}
            className="ml-3 mb-4 border-l border-gray-200 pl-3 space-y-1"
          >
            {group.subsections.map(({ section, index }) => (
              <motion.button
                key={`section-${index}`}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left py-1.5 px-2 rounded text-sm transition-colors ${
                  activeIndex === index
                    ? 'bg-[#3B82F6] bg-opacity-10 text-[#3B82F6] font-medium'
                    : 'hover:bg-gray-100 text-[#4B5563]'
                }`}
                onClick={() => onSectionClick(index)}
              >
                <span className="truncate">
                  {section.level === 3 ? '• ' : ''}{section.title}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </Fragment>
      ))}
    </motion.nav>
  );
};

export default SidebarContent; 