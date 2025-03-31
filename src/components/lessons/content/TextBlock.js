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
    className="bg-[var(--card-bg)] rounded-lg shadow-md p-6 mb-6 border border-[var(--card-border)]"
  >
    {title && <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">{title}</h3>}
    <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--text-primary)]">
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