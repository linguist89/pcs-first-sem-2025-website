'use client';

import Image from 'next/image';

const IllustrationContent = ({ content }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-text-primary mb-4">{content.title}</h2>
    <figure className="mb-4">
      <div className="rounded-lg overflow-hidden">
        <Image 
          src={content.imageUrl} 
          alt={content.alt || content.title}
          width={1200}
          height={800}
          className="w-full h-auto object-contain bg-bg-secondary rounded-lg"
        />
      </div>
      {content.caption && (
        <figcaption className="text-sm text-text-secondary mt-2">
          {content.caption}
        </figcaption>
      )}
    </figure>
    {content.description && (
      <div className="text-text-secondary">
        {content.description}
      </div>
    )}
  </div>
);

export default IllustrationContent; 