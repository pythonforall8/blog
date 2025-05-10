"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  tomorrow,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckIcon, CopyIcon } from "lucide-react";

interface ArticleContentProps {
  content: {
    type: string;
    value: string | string[];
    language?: string;
    level?: number;
  }[];
}

// Custom CodeBlock component with copy functionality
function CodeBlock({ language, value }: { language: string; value: string }) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 group relative">
      <div className="bg-gray-800 text-gray-200 text-xs px-4 py-1.5 rounded-t-md flex justify-between items-center">
        <span className="font-mono">{language.toUpperCase()}</span>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          aria-label="Copy code"
          title="Copy code"
        >
          {copied ? (
            <CheckIcon size={16} className="text-green-500" />
          ) : (
            <CopyIcon size={16} />
          )}
        </button>
      </div>
      <div className="relative rounded-b-md bg-white dark:bg-[#1e1e1e]">
        <SyntaxHighlighter
          language={language}
          style={isDarkTheme ? vscDarkPlus : tomorrow}
          PreTag="div"
          showLineNumbers
          customStyle={{
            margin: 0,
            borderRadius: "0 0 0.375rem 0.375rem",
            fontSize: "0.9rem",
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function ArticleContent({ content }: ArticleContentProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  const headingClasses: Record<string, string> = {
    h1: "text-4xl font-bold mb-6 mt-10",
    h2: "text-3xl font-bold mb-4 mt-8",
    h3: "text-2xl font-semibold mb-3 mt-6",
    h4: "text-xl font-semibold mb-2 mt-4",
    h5: "text-lg font-medium mb-2 mt-4",
    h6: "text-base font-medium mb-2 mt-4",
  };

  const renderContent = (item: any, index: number) => {
    switch (item.type) {
      case "markdown":
        return (
          <motion.div
            key={index}
            className="prose prose-lg dark:prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className={headingClasses.h1}>{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className={headingClasses.h2}>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className={headingClasses.h3}>{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className={headingClasses.h4}>{children}</h4>
                ),
                h5: ({ children }) => (
                  <h5 className={headingClasses.h5}>{children}</h5>
                ),
                h6: ({ children }) => (
                  <h6 className={headingClasses.h6}>{children}</h6>
                ),
                p: ({ children }) => (
                  <p className="mb-6 text-lg leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-lg">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-6 space-y-2 text-lg">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="mb-2">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-6 py-2 my-6 bg-gray-50 dark:bg-gray-800 italic">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-primary hover:underline font-medium"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-8 border dark:border-gray-700 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => <tr>{children}</tr>,
                th: ({ children }) => (
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-6 py-4 text-sm">{children}</td>
                ),
                code: ({ className, children }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return match ? (
                    <CodeBlock
                      language={match[1]}
                      value={String(children).replace(/\n$/, "")}
                    />
                  ) : (
                    <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  );
                },
                img: ({ src, alt }) => (
                  <div className="my-8">
                    <img
                      src={src || ""}
                      alt={alt || ""}
                      className="rounded-lg max-w-full h-auto mx-auto shadow-md"
                    />
                    {alt && (
                      <p className="text-center text-sm text-gray-500 mt-2">
                        {alt}
                      </p>
                    )}
                  </div>
                ),
              }}
            >
              {item.value}
            </ReactMarkdown>
          </motion.div>
        );

      case "paragraph":
        return (
          <motion.p
            key={index}
            className="mb-6 leading-relaxed text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {item.value}
          </motion.p>
        );

      case "heading":
        const tag = `h${item.level}` as keyof typeof headingClasses;
        const Tag = tag as keyof JSX.IntrinsicElements;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Tag className={headingClasses[tag]}> {item.value} </Tag>
          </motion.div>
        );

      case "code":
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CodeBlock
              language={item.language || "text"}
              value={item.value as string}
            />
          </motion.div>
        );

      case "list":
        return (
          <motion.ul
            key={index}
            className="list-disc pl-6 mb-6 space-y-2 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {(item.value as string[]).map((li, i) => (
              <li key={i}>{li}</li>
            ))}
          </motion.ul>
        );

      case "ordered-list":
        return (
          <motion.ol
            key={index}
            className="list-decimal pl-6 mb-6 space-y-2 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {(item.value as string[]).map((li, i) => (
              <li key={i}>{li}</li>
            ))}
          </motion.ol>
        );

      case "blockquote":
        return (
          <motion.blockquote
            key={index}
            className="border-l-4 border-primary pl-6 py-2 my-6 bg-gray-50 dark:bg-gray-800 italic"
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
