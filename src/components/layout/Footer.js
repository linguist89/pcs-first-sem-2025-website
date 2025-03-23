import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-bg-primary border-t border-border-light pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">About Python for Cognitive Science</h3>
            <p className="text-text-secondary mb-4">
              A specialized learning platform designed to equip cognitive science students with Python programming skills for data analysis and machine learning applications in cognitive research.
            </p>
            <div className="flex items-center">
              <svg width="36px" height="36px" viewBox="0 0 36 36" className="mr-2" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                  {/* Python Logo Circle */}
                  <circle cx="18" cy="18" r="16" fill="#3776AB" />
                  
                  {/* Brain Shape */}
                  <path d="M10,14 C10,10.5 12.5,8 16,8 C19.5,8 22,10.5 22,14 C22,16 24,16 24,18 C24,20 22,20 22,22 C22,25.5 19.5,28 16,28 C12.5,28 10,25.5 10,22 C10,20 8,20 8,18 C8,16 10,16 10,14 Z" 
                        fill="#FFD43B" 
                        stroke="#306998" 
                        strokeWidth="1.5" />
                  
                  {/* Brain Folds */}
                  <path d="M12,14 C14,16 18,16 20,14" 
                        stroke="#306998" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        fill="none" />
                  <path d="M12,22 C14,20 18,20 20,22" 
                        stroke="#306998" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        fill="none" />
                  <path d="M16,8 C16,12 16,24 16,28" 
                        stroke="#306998" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        fill="none" />

                  {/* Python-like Curve */}
                  <path d="M26,12 C28,14 28,22 26,24" 
                        stroke="#FFD43B" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        fill="none" />
                </g>
              </svg>
              <span className="text-lg font-bold text-primary">Python for Cognitive Science</span>
            </div>
          </div>
          
          {/* Column 2: Site Map */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Site Map</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-text-secondary hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/lessons" className="text-text-secondary hover:text-primary transition-colors">
                  Lessons
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-text-secondary hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-text-secondary">sps@cas.au.dk</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="pt-6 border-t border-border-light">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <p className="text-text-secondary text-sm">
              &copy; {currentYear} Python for Cognitive Science. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 