'use client';

import MarkdownRenderer from '../MarkdownRenderer';

// Text content section
const TextContent = ({ content }) => (
  <div className="prose prose-sm max-w-none text-text-secondary overflow-hidden">
    <h2 className="text-xl font-bold text-text-primary mb-4">{content.title}</h2>
    <div className="overflow-x-auto">
      <MarkdownRenderer content={content.content} />
    </div>
  </div>
);

export default TextContent; 