const BrainLogo = ({ className, primaryColor, secondaryColor }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Brain outline */}
      <path
        d="M50,85 C25,85 15,70 15,50 C15,30 30,15 50,15 C70,15 85,30 85,50 C85,70 75,85 50,85 Z"
        fill="none"
        stroke={primaryColor || 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Brain details - left hemisphere */}
      <path
        d="M30,30 C25,35 23,40 25,45 C27,50 30,52 28,57 C26,62 25,65 30,70"
        fill="none"
        stroke={primaryColor || 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M38,25 C33,30 30,35 34,40 C38,45 40,47 36,52 C32,57 30,65 35,70"
        fill="none"
        stroke={primaryColor || 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Brain details - right hemisphere */}
      <path
        d="M70,30 C75,35 77,40 75,45 C73,50 70,52 72,57 C74,62 75,65 70,70"
        fill="none"
        stroke={primaryColor || 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M62,25 C67,30 70,35 66,40 C62,45 60,47 64,52 C68,57 70,65 65,70"
        fill="none"
        stroke={primaryColor || 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Connection between hemispheres */}
      <path
        d="M50,25 C50,40 50,60 50,75"
        fill="none"
        stroke={primaryColor || 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2,3"
      />
      
      {/* Python symbol - intertwined snakes */}
      <path
        d="M40,50 C40,45 45,45 50,45 C55,45 60,45 60,50 C60,55 55,55 50,55 C45,55 40,55 40,50 Z"
        fill={secondaryColor || '#3776AB'}
        stroke="none"
      />
      <path
        d="M45,45 C45,40 47.5,40 50,40 C52.5,40 55,40 55,45"
        fill="none"
        stroke={secondaryColor || '#3776AB'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M45,55 C45,60 47.5,60 50,60 C52.5,60 55,60 55,55"
        fill="none"
        stroke={secondaryColor || '#3776AB'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Neural network nodes */}
      <circle cx="30" cy="40" r="2" fill={secondaryColor || '#3776AB'} />
      <circle cx="35" cy="55" r="2" fill={secondaryColor || '#3776AB'} />
      <circle cx="70" cy="40" r="2" fill={secondaryColor || '#3776AB'} />
      <circle cx="65" cy="55" r="2" fill={secondaryColor || '#3776AB'} />
      <circle cx="50" cy="30" r="2" fill={secondaryColor || '#3776AB'} />
      <circle cx="50" cy="70" r="2" fill={secondaryColor || '#3776AB'} />
      
      {/* Neural network connections */}
      <line x1="30" y1="40" x2="35" y2="55" stroke={secondaryColor || '#3776AB'} strokeWidth="1" />
      <line x1="30" y1="40" x2="50" y2="30" stroke={secondaryColor || '#3776AB'} strokeWidth="1" />
      <line x1="35" y1="55" x2="50" y2="70" stroke={secondaryColor || '#3776AB'} strokeWidth="1" />
      <line x1="70" y1="40" x2="65" y2="55" stroke={secondaryColor || '#3776AB'} strokeWidth="1" />
      <line x1="70" y1="40" x2="50" y2="30" stroke={secondaryColor || '#3776AB'} strokeWidth="1" />
      <line x1="65" y1="55" x2="50" y2="70" stroke={secondaryColor || '#3776AB'} strokeWidth="1" />
    </svg>
  );
};

export default BrainLogo; 