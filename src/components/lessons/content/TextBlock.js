'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const TextBlock = ({ content, title }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-lg shadow-md p-6 mb-6"
  >
    {title && <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>}
    <div className="prose prose-sm max-w-none text-gray-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  </motion.div>
);

export default TextBlock; 