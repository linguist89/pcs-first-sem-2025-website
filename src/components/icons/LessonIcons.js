// A collection of SVG illustrations for the 7 lessons
// Each illustration represents a different topic in Python for Cognitive Science

// Lesson 1: Introduction to Python
export const IntroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Python logo stylized */}
    <path
      d="M50,20 C40,20 35,25 35,35 L35,40 L55,40 L55,43 L30,43 C20,43 15,50 15,60 C15,70 20,75 30,75 L35,75 L35,65 C35,55 40,50 50,50 L65,50 C75,50 80,45 80,35 L80,30 C80,20 75,15 65,15 L50,20 Z"
      fill="#3776AB"
      stroke="none"
    />
    <circle cx="42.5" cy="30" r="3" fill="white" />
    <path
      d="M50,80 C60,80 65,75 65,65 L65,60 L45,60 L45,57 L70,57 C80,57 85,50 85,40 C85,30 80,25 70,25 L65,25 L65,35 C65,45 60,50 50,50 L35,50 C25,50 20,55 20,65 L20,70 C20,80 25,85 35,85 L50,80 Z"
      fill="#FFD43B"
      stroke="none"
    />
    <circle cx="57.5" cy="70" r="3" fill="white" />
  </svg>
);

// Lesson 2: Data Types and Variables
export const DataTypesIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Data types representation */}
    <rect x="15" y="15" width="30" height="20" rx="2" fill="#FF6B6B" stroke="#333" strokeWidth="1" />
    <text x="30" y="28" fontSize="10" textAnchor="middle" fill="white">str</text>
    
    <rect x="55" y="15" width="30" height="20" rx="2" fill="#4ECDC4" stroke="#333" strokeWidth="1" />
    <text x="70" y="28" fontSize="10" textAnchor="middle" fill="white">int</text>
    
    <rect x="15" y="45" width="30" height="20" rx="2" fill="#FFE66D" stroke="#333" strokeWidth="1" />
    <text x="30" y="58" fontSize="10" textAnchor="middle" fill="black">bool</text>
    
    <rect x="55" y="45" width="30" height="20" rx="2" fill="#6A0572" stroke="#333" strokeWidth="1" />
    <text x="70" y="58" fontSize="10" textAnchor="middle" fill="white">float</text>
    
    <rect x="35" y="75" width="30" height="20" rx="2" fill="#1A535C" stroke="#333" strokeWidth="1" />
    <text x="50" y="88" fontSize="10" textAnchor="middle" fill="white">list</text>
    
    {/* Connecting lines */}
    <line x1="30" y1="35" x2="30" y2="45" stroke="#333" strokeWidth="1" />
    <line x1="70" y1="35" x2="70" y2="45" stroke="#333" strokeWidth="1" />
    <line x1="30" y1="65" x2="40" y2="75" stroke="#333" strokeWidth="1" />
    <line x1="70" y1="65" x2="60" y2="75" stroke="#333" strokeWidth="1" />
  </svg>
);

// Lesson 3: Control Flow
export const ControlFlowIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Flowchart */}
    <rect x="35" y="10" width="30" height="15" rx="7.5" fill="#4CAF50" stroke="#333" strokeWidth="1" />
    <text x="50" y="20" fontSize="8" textAnchor="middle" fill="white">Start</text>
    
    <polygon points="50,35 60,45 50,55 40,45" fill="#2196F3" stroke="#333" strokeWidth="1" />
    <text x="50" y="47" fontSize="8" textAnchor="middle" fill="white">if</text>
    
    <rect x="15" y="60" width="30" height="15" rx="2" fill="#FFC107" stroke="#333" strokeWidth="1" />
    <text x="30" y="70" fontSize="8" textAnchor="middle" fill="black">True</text>
    
    <rect x="55" y="60" width="30" height="15" rx="2" fill="#FF5722" stroke="#333" strokeWidth="1" />
    <text x="70" y="70" fontSize="8" textAnchor="middle" fill="white">False</text>
    
    <rect x="35" y="85" width="30" height="15" rx="7.5" fill="#9C27B0" stroke="#333" strokeWidth="1" />
    <text x="50" y="95" fontSize="8" textAnchor="middle" fill="white">End</text>
    
    {/* Connecting arrows */}
    <line x1="50" y1="25" x2="50" y2="35" stroke="#333" strokeWidth="1" />
    <line x1="40" y1="45" x2="30" y2="60" stroke="#333" strokeWidth="1" />
    <line x1="60" y1="45" x2="70" y2="60" stroke="#333" strokeWidth="1" />
    <line x1="30" y1="75" x2="45" y2="85" stroke="#333" strokeWidth="1" />
    <line x1="70" y1="75" x2="55" y2="85" stroke="#333" strokeWidth="1" />
  </svg>
);

// Lesson 4: Functions and Modules
export const FunctionsIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Function representation */}
    <rect x="20" y="20" width="60" height="25" rx="3" fill="#3949AB" stroke="#333" strokeWidth="1" />
    <text x="50" y="33" fontSize="10" textAnchor="middle" fill="white">def function():</text>
    
    <rect x="30" y="55" width="40" height="15" rx="2" fill="#7986CB" stroke="#333" strokeWidth="1" />
    <text x="50" y="65" fontSize="8" textAnchor="middle" fill="white">calculation</text>
    
    <rect x="30" y="75" width="40" height="15" rx="2" fill="#7986CB" stroke="#333" strokeWidth="1" />
    <text x="50" y="85" fontSize="8" textAnchor="middle" fill="white">return result</text>
    
    {/* Connecting lines */}
    <line x1="50" y1="45" x2="50" y2="55" stroke="#333" strokeWidth="1" />
    <line x1="50" y1="70" x2="50" y2="75" stroke="#333" strokeWidth="1" />
    
    {/* Input/Output arrows */}
    <polygon points="15,30 25,25 25,35" fill="#FF9800" stroke="#333" strokeWidth="1" />
    <polygon points="85,30 75,25 75,35" fill="#8BC34A" stroke="#333" strokeWidth="1" />
  </svg>
);

// Lesson 5: Data Analysis with Pandas
export const PandasIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Data table */}
    <rect x="20" y="20" width="60" height="60" fill="#EFEFEF" stroke="#333" strokeWidth="1" />
    
    {/* Table header */}
    <rect x="20" y="20" width="60" height="15" fill="#150458" stroke="#333" strokeWidth="1" />
    <line x1="40" y1="20" x2="40" y2="80" stroke="#333" strokeWidth="1" />
    <line x1="60" y1="20" x2="60" y2="80" stroke="#333" strokeWidth="1" />
    <line x1="20" y1="35" x2="80" y2="35" stroke="#333" strokeWidth="1" />
    <line x1="20" y1="50" x2="80" y2="50" stroke="#333" strokeWidth="1" />
    <line x1="20" y1="65" x2="80" y2="65" stroke="#333" strokeWidth="1" />
    
    {/* Pandas logo */}
    <rect x="70" y="70" width="20" height="20" rx="3" fill="white" stroke="#333" strokeWidth="1" />
    <rect x="73" y="73" width="6" height="14" rx="1" fill="#150458" />
    <rect x="81" y="73" width="6" height="14" rx="1" fill="#E70488" />
    
    {/* Data points */}
    <circle cx="30" y="42.5" r="3" fill="#E70488" />
    <circle cx="50" y="42.5" r="3" fill="#E70488" />
    <circle cx="70" y="42.5" r="3" fill="#E70488" />
    <circle cx="30" y="57.5" r="3" fill="#150458" />
    <circle cx="50" y="57.5" r="3" fill="#150458" />
    <circle cx="70" y="57.5" r="3" fill="#150458" />
    <circle cx="30" y="72.5" r="3" fill="#E70488" />
    <circle cx="50" y="72.5" r="3" fill="#150458" />
    <circle cx="70" y="72.5" r="3" fill="#E70488" />
  </svg>
);

// Lesson 6: Data Visualization
export const VisualizationIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Chart elements */}
    <rect x="15" y="15" width="70" height="70" fill="white" stroke="#333" strokeWidth="1" />
    
    {/* Axes */}
    <line x1="25" y1="75" x2="75" y2="75" stroke="#333" strokeWidth="2" />
    <line x1="25" y1="25" x2="25" y2="75" stroke="#333" strokeWidth="2" />
    
    {/* Bar chart */}
    <rect x="30" y="55" width="8" height="20" fill="#4285F4" />
    <rect x="45" y="40" width="8" height="35" fill="#EA4335" />
    <rect x="60" y="50" width="8" height="25" fill="#FBBC05" />
    
    {/* Line chart */}
    <polyline points="25,35 35,45 50,30 65,40 75,25" fill="none" stroke="#34A853" strokeWidth="2" />
    
    {/* Data points */}
    <circle cx="25" cy="35" r="2" fill="#34A853" />
    <circle cx="35" cy="45" r="2" fill="#34A853" />
    <circle cx="50" cy="30" r="2" fill="#34A853" />
    <circle cx="65" cy="40" r="2" fill="#34A853" />
    <circle cx="75" cy="25" r="2" fill="#34A853" />
    
    {/* Matplotlib-inspired logo (simplified) */}
    <path d="M85,85 L90,80 L90,90 Z" fill="#11557C" />
  </svg>
);

// Lesson 7: Machine Learning Basics
export const MachineLearningIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Brain outline */}
    <ellipse cx="50" cy="40" rx="30" ry="25" fill="#F5F5F5" stroke="#333" strokeWidth="1" />
    
    {/* Neural network */}
    {/* Input layer */}
    <circle cx="25" cy="30" r="3" fill="#FF6F00" />
    <circle cx="25" cy="40" r="3" fill="#FF6F00" />
    <circle cx="25" cy="50" r="3" fill="#FF6F00" />
    
    {/* Hidden layer */}
    <circle cx="50" cy="25" r="3" fill="#1976D2" />
    <circle cx="50" cy="35" r="3" fill="#1976D2" />
    <circle cx="50" cy="45" r="3" fill="#1976D2" />
    <circle cx="50" cy="55" r="3" fill="#1976D2" />
    
    {/* Output layer */}
    <circle cx="75" cy="35" r="3" fill="#388E3C" />
    <circle cx="75" cy="45" r="3" fill="#D32F2F" />
    
    {/* Connections */}
    {/* Input to hidden */}
    <line x1="25" y1="30" x2="50" y2="25" stroke="#BDBDBD" strokeWidth="0.5" />
    <line x1="25" y1="30" x2="50" y2="35" stroke="#BDBDBD" strokeWidth="0.5" />
    <line x1="25" y1="30" x2="50" y2="45" stroke="#BDBDBD" strokeWidth="0.5" />
    <line x1="25" y1="30" x2="50" y2="55" stroke="#BDBDBD" strokeWidth="0.5" />
    
    <line x1="25" y1="40" x2="50" y2="25" stroke="#BDBDBD" strokeWidth="0.5" />
    <line x1="25" y1="40" x2="50" y2="35" stroke="#BDBDBD" strokeWidth="0.5" />
    <line x1="25" y1="40" x2="50" y2="45" stroke="#BDBDBD" strokeWidth="0.5" />
    <line x1="25" y1="40" x2="50" y2="55" stroke="#BDBDBD" strokeWidth="0.5" />
    
    <line x1="25" y1="50" x2="50" y2="25" stroke="#BDBDBD" strokeWidth="0.5" />
    <line x1="25" y1="50" x2="50" y2="35" stroke="#BDBDBD" strokeWidth="0.5" />
    <line x1="25" y1="50" x2="50" y2="45" stroke="#BDBDBD" strokeWidth="0.5" />
    <line x1="25" y1="50" x2="50" y2="55" stroke="#BDBDBD" strokeWidth="0.5" />
    
    {/* Hidden to output */}
    <line x1="50" y1="25" x2="75" y2="35" stroke="#BDBDBD" strokeWidth="0.5" />
    <line x1="50" y1="25" x2="75" y2="45" stroke="#BDBDBD" strokeWidth="0.5" />
    
    <line x1="50" y1="35" x2="75" y2="35" stroke="#BDBDBD" strokeWidth="0.5" />
    <line x1="50" y1="35" x2="75" y2="45" stroke="#BDBDBD" strokeWidth="0.5" />
    
    <line x1="50" y1="45" x2="75" y2="35" stroke="#BDBDBD" strokeWidth="0.5" />
    <line x1="50" y1="45" x2="75" y2="45" stroke="#BDBDBD" strokeWidth="0.5" />
    
    <line x1="50" y1="55" x2="75" y2="35" stroke="#BDBDBD" strokeWidth="0.5" />
    <line x1="50" y1="55" x2="75" y2="45" stroke="#BDBDBD" strokeWidth="0.5" />
    
    {/* Data flow */}
    <path d="M20,80 C30,65 45,75 50,65 C55,55 65,65 75,60" fill="none" stroke="#7B1FA2" strokeWidth="2" strokeDasharray="3,2" />
    <polygon points="75,60 80,62 76,66" fill="#7B1FA2" />
    
    {/* Classification boundary */}
    <path d="M25,75 Q50,65 75,75" fill="none" stroke="#E64A19" strokeWidth="1.5" strokeDasharray="2,2" />
    
    {/* Data points */}
    <circle cx="35" cy="65" r="2" fill="#388E3C" />
    <circle cx="40" cy="70" r="2" fill="#388E3C" />
    <circle cx="30" cy="72" r="2" fill="#388E3C" />
    <circle cx="60" cy="68" r="2" fill="#D32F2F" />
    <circle cx="65" cy="73" r="2" fill="#D32F2F" />
    <circle cx="70" cy="65" r="2" fill="#D32F2F" />
  </svg>
); 