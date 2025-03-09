'use client';

// Custom style for fixing inline code in lists
const CustomStyle = () => (
  <style jsx global>{`
    /* Fix for inline code in list items */
    .custom-markdown ul li,
    .custom-markdown ol li {
      margin-bottom: 0.75rem !important;
    }
    
    .custom-markdown ul li p,
    .custom-markdown ol li p {
      display: inline !important;
      margin: 0 !important;
    }
    
    .custom-markdown ul li code,
    .custom-markdown ol li code {
      white-space: normal !important;
      word-break: normal !important;
      display: inline !important;
      font-family: monospace !important;
      background-color: var(--bg-accent, rgba(0, 100, 200, 0.1)) !important;
      color: var(--text-primary, inherit) !important;
      padding: 0.1rem 0.3rem !important;
      border-radius: 0.25rem !important;
      font-size: 0.875rem !important;
      line-height: inherit !important;
      vertical-align: baseline !important;
      border: 1px solid var(--border-light, rgba(0, 100, 200, 0.2)) !important;
    }
    
    /* Ensure no breaks around inline code */
    .custom-markdown li code {
      break-inside: avoid !important;
      break-before: avoid !important;
      break-after: avoid !important;
    }
    
    /* Force list items to display properly */
    .custom-markdown li .mb-6.relative {
      display: inline !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    /* Hide syntax highlighter controls in list items */
    .custom-markdown li .absolute.top-2.right-2 {
      display: none !important;
    }
    
    /* Correct the appearance of code in list items */
    .custom-markdown li pre {
      display: inline !important;
      margin: 0 !important;
      padding: 0 !important;
      background: none !important;
      border: none !important;
      white-space: normal !important;
    }
    
    .custom-markdown li pre code {
      display: inline !important;
      white-space: normal !important;
      background-color: var(--bg-accent, rgba(0, 100, 200, 0.1)) !important;
      color: var(--text-primary, inherit) !important;
      padding: 0.1rem 0.3rem !important;
      border-radius: 0.25rem !important;
      font-size: 0.875rem !important;
      line-height: inherit !important;
      border: 1px solid var(--border-light, rgba(0, 100, 200, 0.2)) !important;
    }
    
    /* Hide line numbers in inline code */
    .custom-markdown li pre code .linenumber {
      display: none !important;
    }
    
    /* Ensure inline code stands out in paragraphs too */
    .custom-markdown p code {
      background-color: var(--bg-accent, rgba(0, 100, 200, 0.1)) !important;
      color: var(--text-primary, inherit) !important;
      padding: 0.1rem 0.3rem !important;
      border-radius: 0.25rem !important;
      font-family: monospace !important;
      font-size: 0.875rem !important;
      border: 1px solid var(--border-light, rgba(0, 100, 200, 0.2)) !important;
    }
    
    /* Prevent content overflow */
    .custom-markdown {
      max-width: 100% !important;
      overflow-wrap: break-word !important;
      word-wrap: break-word !important;
    }
    
    /* Ensure pre blocks don't overflow */
    .custom-markdown pre {
      white-space: pre-wrap !important;
      word-break: break-word !important;
      overflow-x: auto !important;
      max-width: 100% !important;
    }
    
    /* Ensure images don't overflow */
    .custom-markdown img {
      max-width: 100% !important;
      height: auto !important;
    }
    
    /* Handle tables properly */
    .custom-markdown table {
      display: block !important;
      width: 100% !important;
      overflow-x: auto !important;
      border-collapse: collapse !important;
    }
    
    /* Handle long words in paragraph */
    .custom-markdown p {
      overflow-wrap: break-word !important;
      word-wrap: break-word !important;
      hyphens: auto !important;
    }
  `}</style>
);

export default CustomStyle; 