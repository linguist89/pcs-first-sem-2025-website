'use client';

const ResourcesContent = ({ content }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-text-primary mb-4">{content.title}</h2>
    <div className="space-y-4">
      <h3 className="font-medium text-text-primary">Links</h3>
      <ul className="space-y-2">
        {content.links && content.links.map((link, index) => (
          <li key={index}>
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <div>
                <div className="font-medium">{link.title}</div>
                <div className="text-sm text-text-secondary">{link.description}</div>
              </div>
            </a>
          </li>
        ))}
      </ul>
      {content.downloads && (
        <>
          <h3 className="font-medium text-text-primary mt-4">Downloads</h3>
          <ul className="space-y-2">
            {content.downloads.map((download, index) => (
              <li key={index}>
                <a 
                  href={download.url} 
                  className="text-primary hover:underline flex items-start"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <div>
                    <div className="font-medium">{download.title}</div>
                    <div className="text-sm text-text-secondary">{download.description}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  </div>
);

export default ResourcesContent; 