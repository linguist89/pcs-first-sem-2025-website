const BrainCode = ({ className }) => {
  return (
    <svg
      viewBox="0 0 500 400"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-secondary)" />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="500" height="400" rx="20" fill="url(#bgGradient)" />
      
      {/* Brain outline */}
      <path
        d="M250,300 C175,300 125,250 125,175 C125,100 175,50 250,50 C325,50 375,100 375,175 C375,250 325,300 250,300 Z"
        fill="none"
        stroke="url(#brainGradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Left hemisphere details */}
      <path
        d="M170,100 C150,120 140,140 150,160 C160,180 175,190 165,210 C155,230 150,250 170,270"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M200,80 C180,100 170,120 190,140 C210,160 220,170 200,190 C180,210 170,230 190,260"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Right hemisphere details */}
      <path
        d="M330,100 C350,120 360,140 350,160 C340,180 325,190 335,210 C345,230 350,250 330,270"
        fill="none"
        stroke="var(--color-secondary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M300,80 C320,100 330,120 310,140 C290,160 280,170 300,190 C320,210 330,230 310,260"
        fill="none"
        stroke="var(--color-secondary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Center connection */}
      <path
        d="M250,80 C250,120 250,230 250,270"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6,4"
      />
      
      {/* Code snippets */}
      {/* Python code on the left */}
      <rect x="70" y="140" width="120" height="120" rx="10" fill="rgba(0,0,0,0.7)" />
      <text x="80" y="160" fontSize="10" fill="#4AF626" fontFamily="monospace">import numpy as np</text>
      <text x="80" y="175" fontSize="10" fill="#4AF626" fontFamily="monospace">def neural_net():</text>
      <text x="90" y="190" fontSize="10" fill="#4AF626" fontFamily="monospace">x = np.array([1,2,3])</text>
      <text x="90" y="205" fontSize="10" fill="#4AF626" fontFamily="monospace">y = x * 2</text>
      <text x="90" y="220" fontSize="10" fill="#4AF626" fontFamily="monospace">return sigmoid(y)</text>
      <text x="80" y="235" fontSize="10" fill="#4AF626" fontFamily="monospace">result = neural_net()</text>
      <text x="80" y="250" fontSize="10" fill="#4AF626" fontFamily="monospace">print(result)</text>
      
      {/* Data/Output on the right */}
      <rect x="310" y="140" width="120" height="120" rx="10" fill="rgba(0,0,0,0.7)" />
      <text x="320" y="160" fontSize="10" fill="#FFD700" fontFamily="monospace">COGNITIVE MODEL</text>
      <text x="320" y="175" fontSize="10" fill="#FFD700" fontFamily="monospace">==============</text>
      <text x="320" y="190" fontSize="10" fill="#FFD700" fontFamily="monospace">Input: [1,2,3]</text>
      <text x="320" y="205" fontSize="10" fill="#FFD700" fontFamily="monospace">Processing...</text>
      <text x="320" y="220" fontSize="10" fill="#FFD700" fontFamily="monospace">Layer 1: [0.88,0.98,0.99]</text>
      <text x="320" y="235" fontSize="10" fill="#FFD700" fontFamily="monospace">Layer 2: [0.95]</text>
      <text x="320" y="250" fontSize="10" fill="#FFD700" fontFamily="monospace">Output: Decision = YES</text>
      
      {/* Neural connections */}
      <path
        d="M190,200 C220,160 230,210 250,175 C270,140 280,230 310,200"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeDasharray="1,1"
      />
      
      {/* Neural nodes */}
      <circle cx="190" cy="200" r="4" fill="var(--color-primary)" />
      <circle cx="230" cy="175" r="4" fill="var(--color-primary)" />
      <circle cx="250" cy="175" r="4" fill="var(--color-accent)" />
      <circle cx="270" cy="175" r="4" fill="var(--color-secondary)" />
      <circle cx="310" cy="200" r="4" fill="var(--color-secondary)" />
      
      {/* Python logos */}
      <g transform="translate(145, 320) scale(0.12)">
        <path
          d="M116.948,0.001c-5.701,0.021-11.467,0.491-16.519,1.301c-14.642,2.346-17.303,7.243-17.303,16.292v11.949
          h34.607v4.421h-47.635c-9.106,0-17.104,5.467-19.607,15.878c-2.892,11.92-3.017,19.24,0,31.592
          c2.237,9.146,7.629,15.743,16.736,15.743h10.782v-14.233c0-10.187,8.86-19.252,19.607-19.252h34.591
          c8.744,0,15.709-7.192,15.709-15.816V17.393c0-8.435-7.148-14.783-15.709-16.202
          C127.258,0.282,122.65-0.019,116.948,0.001z M86.49,8.696c3.587,0,6.498,2.981,6.498,6.643
          c0,3.649-2.911,6.563-6.498,6.563c-3.577,0-6.498-2.914-6.498-6.563C79.992,11.677,82.914,8.696,86.49,8.696z"
          fill="#3776AB"
        />
        <path
          d="M154.986,17.743v13.798c0,10.686-9.066,19.697-19.607,19.697h-34.591
          c-8.603,0-15.709,7.338-15.709,15.933v29.844c0,8.435,7.358,13.367,15.709,15.817c9.996,2.921,19.625,3.445,34.591,0
          c9.957-2.285,15.709-6.893,15.709-15.817V85.066h-34.591v-4.422h52.017c9.107,0,12.486-6.332,15.709-15.878
          c3.336-9.884,3.185-19.333,0-31.753c-2.299-8.904-6.679-15.878-15.709-15.878h-11.851
          C157.562,17.135,156.364,17.349,154.986,17.743z M125.418,85.066c3.577,0,6.498,2.914,6.498,6.563
          c0,3.662-2.921,6.643-6.498,6.643c-3.587,0-6.498-2.981-6.498-6.643C118.92,87.981,121.831,85.066,125.418,85.066z"
          fill="#FFD43B"
        />
      </g>
      
      {/* Digital circuit connections */}
      <line x1="230" y1="320" x2="270" y2="320" stroke="var(--color-accent)" strokeWidth="2" />
      <line x1="230" y1="320" x2="230" y2="350" stroke="var(--color-accent)" strokeWidth="2" />
      <line x1="270" y1="320" x2="270" y2="350" stroke="var(--color-accent)" strokeWidth="2" />
      <line x1="210" y1="350" x2="290" y2="350" stroke="var(--color-accent)" strokeWidth="2" />
      <circle cx="230" cy="320" r="3" fill="var(--color-accent)" />
      <circle cx="270" cy="320" r="3" fill="var(--color-accent)" />
      <circle cx="230" cy="350" r="3" fill="var(--color-accent)" />
      <circle cx="270" cy="350" r="3" fill="var(--color-accent)" />
      <circle cx="210" cy="350" r="3" fill="var(--color-accent)" />
      <circle cx="290" cy="350" r="3" fill="var(--color-accent)" />
      
      {/* Particles and neuron sparks */}
      <circle cx="180" cy="120" r="2" fill="var(--color-primary)" opacity="0.7" />
      <circle cx="220" cy="100" r="1.5" fill="var(--color-primary)" opacity="0.5" />
      <circle cx="260" cy="110" r="2" fill="var(--color-accent)" opacity="0.7" />
      <circle cx="300" cy="130" r="1.5" fill="var(--color-secondary)" opacity="0.5" />
      <circle cx="330" cy="110" r="2" fill="var(--color-secondary)" opacity="0.7" />
      <circle cx="200" cy="250" r="1.5" fill="var(--color-primary)" opacity="0.5" />
      <circle cx="240" cy="270" r="2" fill="var(--color-primary)" opacity="0.7" />
      <circle cx="280" cy="240" r="1.5" fill="var(--color-secondary)" opacity="0.5" />
      <circle cx="320" cy="260" r="2" fill="var(--color-secondary)" opacity="0.7" />
    </svg>
  );
};

export default BrainCode; 