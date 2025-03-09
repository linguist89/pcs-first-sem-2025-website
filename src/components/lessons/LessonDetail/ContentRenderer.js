'use client';

import TextContent from './content/TextContent';
import CodeContent from './content/CodeContent';
import IllustrationContent from './content/IllustrationContent';
import InteractiveContent from './content/InteractiveContent';
import ResourcesContent from './content/ResourcesContent';

// The ContentRenderer component decides which content component to render based on content type
const ContentRenderer = ({ contentKey, contentElements }) => {
  // Find the appropriate content handler based on the content type
  const contentTypeMap = {
    text: TextContent,
    code: CodeContent,
    illustration: IllustrationContent,
    interactive: InteractiveContent,
    resources: ResourcesContent,
  };

  // Default to text content if type not recognized
  if (!contentElements || !contentElements[contentKey]) {
    return <div>Content not found</div>;
  }

  const content = contentElements[contentKey];
  const ContentComponent = contentTypeMap[content.type] || TextContent;

  return <ContentComponent content={content} />;
};

export default ContentRenderer; 