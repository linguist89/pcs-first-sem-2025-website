import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-bg-primary border-t border-border-light pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">About EdTech Course</h3>
            <p className="text-text-secondary mb-4">
              A comprehensive learning platform designed for in-class teaching, providing students with access to course materials, interactive lessons, and educational resources.
            </p>
            <div className="flex items-center">
              <Image 
                src="/images/logo.svg" 
                alt="EdTech Course Logo" 
                width={120} 
                height={30} 
                className="h-8 w-auto"
              />
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
                <Link href="/resources" className="text-text-secondary hover:text-primary transition-colors">
                  Resources
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
                <span className="text-text-secondary">contact@spsdigitaltech.com</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-text-secondary">Office Hours: 9AM - 5PM (Mon-Fri)</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-text-secondary">+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="pt-6 border-t border-border-light">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <p className="text-text-secondary text-sm mb-4 md:mb-0">
              &copy; {currentYear} EdTech Course. All rights reserved.
            </p>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/terms" className="text-text-secondary hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-text-secondary hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/accessibility" className="text-text-secondary hover:text-primary transition-colors">
                Accessibility
              </Link>
              <Link href="/cookies" className="text-text-secondary hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 