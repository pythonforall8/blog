'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';

interface ArticleContentProps {
  content: {
    type: string;
    value: string;
    language?: string;
    level?: number;
  }[];
}

export function ArticleContent({ content }: ArticleContentProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  const renderContent = (item: any, index: number) => {
    switch (item.type) {
      case 'paragraph':
        return (
          <motion.p 
            key={index}
            className="mb-6 leading-relaxed" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {item.value}
          </motion.p>
        );
      case 'heading':
        const HeadingTag = `h${item.level}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          h1: 'text-3xl font-bold mt-10 mb-6',
          h2: 'text-2xl font-bold mt-8 mb-4',
          h3: 'text-xl font-bold mt-6 mb-4',
          h4: 'text-lg font-bold mt-6 mb-4',
          h5: 'text-base font-bold mt-4 mb-2',
          h6: 'text-sm font-bold mt-4 mb-2'
        };
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <HeadingTag className={headingClasses[HeadingTag]}>
              {item.value}
            </HeadingTag>
          </motion.div>
        );
      case 'code':
        return (
          <motion.div 
            key={index}
            className="mb-6 rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <SyntaxHighlighter
              language={item.language || 'python'}
              style={isDarkTheme ? vscDarkPlus : vs}
              customStyle={{
                borderRadius: '0.5rem',
                padding: '1.5rem',
                fontSize: '0.9rem',
              }}
            >
              {item.value}
            </SyntaxHighlighter>
          </motion.div>
        );
      case 'list':
        return (
          <motion.ul 
            key={index}
            className="list-disc pl-6 mb-6 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {item.value.map((li: string, i: number) => (
              <li key={i}>{li}</li>
            ))}
          </motion.ul>
        );
      case 'ordered-list':
        return (
          <motion.ol 
            key={index}
            className="list-decimal pl-6 mb-6 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {item.value.map((li: string, i: number) => (
              <li key={i}>{li}</li>
            ))}
          </motion.ol>
        );
      case 'blockquote':
        return (
          <motion.blockquote 
            key={index}
            className="border-l-4 border-primary pl-4 italic my-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {item.value}
          </motion.blockquote>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="prose dark:prose-invert max-w-none">
      {content.map(renderContent)}
    </div>
  );
}