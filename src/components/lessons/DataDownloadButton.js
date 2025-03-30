'use client';

import { useState } from 'react';

export default function DataDownloadButton({ dataUrl, fileName }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  
  // Default filename if none provided
  const displayFileName = fileName || dataUrl.split('/').pop();
  
  const handleDownload = async () => {
    if (!dataUrl) return;
    
    setDownloading(true);
    setError(null);
    
    try {
      // Fetch the file
      const response = await fetch(dataUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }
      
      // Get the file content
      const fileContent = await response.text();
      
      // Create a blob from the content
      const blob = new Blob([fileContent], { type: 'text/plain' });
      
      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = displayFileName;
      
      // Add to document, click and remove
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Clean up the object URL
      URL.revokeObjectURL(downloadLink.href);
    } catch (err) {
      console.error('Error downloading file:', err);
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  };
  
  if (!dataUrl) {
    return null;
  }
  
  return (
    <div className="my-4">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Downloading...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download {displayFileName}
          </>
        )}
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          Error: {error}. Please try again or download manually from <a href={dataUrl} target="_blank" rel="noopener noreferrer" className="underline">this link</a>.
        </div>
      )}
    </div>
  );
} 