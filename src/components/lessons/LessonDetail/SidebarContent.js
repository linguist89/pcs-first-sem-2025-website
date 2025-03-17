'use client';

import { Fragment } from 'react';

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

  return (
    <nav className="sidebar-content mt-4">
      {groupedSections.map((group, groupIndex) => (
        <Fragment key={`group-${groupIndex}`}>
          {/* Main section (usually H1) */}
          <button
            className={`w-full text-left py-2 px-3 rounded-md mb-2 font-medium transition-colors flex items-center ${
              activeIndex === group.mainIndex
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100 text-text-primary'
            }`}
            onClick={() => onSectionClick(group.mainIndex)}
          >
            <span className="truncate">{group.main.title}</span>
          </button>

          {/* Subsections (H2 and H3) */}
          <div className="ml-3 mb-4 border-l border-gray-200 pl-3 space-y-1">
            {group.subsections.map(({ section, index }) => (
              <button
                key={`section-${index}`}
                className={`w-full text-left py-1.5 px-2 rounded text-sm transition-colors ${
                  activeIndex === index
                    ? 'bg-primary bg-opacity-10 text-primary font-medium'
                    : 'hover:bg-gray-100 text-text-secondary'
                }`}
                onClick={() => onSectionClick(index)}
              >
                <span className="truncate">
                  {section.level === 3 ? '• ' : ''}{section.title}
                </span>
              </button>
            ))}
          </div>
        </Fragment>
      ))}
    </nav>
  );
};

export default SidebarContent; 