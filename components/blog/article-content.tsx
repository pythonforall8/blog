"use client";

import React from "react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

interface ArticleContentProps {
  content: {
    type: string;
    value: string | string[];
    language?: string;
    level?: number;
  }[];
}

export function ArticleContent({ content }: ArticleContentProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  const headingClasses: {
    [key in "h1" | "h2" | "h3" | "h4" | "h5" | "h6"]: string;
  } = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-semibold",
    h4: "text-xl font-semibold",
    h5: "text-lg font-medium",
    h6: "text-base font-medium",
  };

  const renderContent = (item: any, index: number) => {
    switch (item.type) {
      case "paragraph":
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
            <Tag className={headingClasses[tag]}>{item.value}</Tag>
          </motion.div>
        );

      case "code":
        return (
          <motion.div
            key={index}
            className="mb-6 rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <SyntaxHighlighter
              language={item.language || "python"}
              style={isDarkTheme ? vscDarkPlus : vs}
              customStyle={{
                borderRadius: "0.5rem",
                padding: "1.5rem",
                fontSize: "0.9rem",
              }}
            >
              {item.value as string}
            </SyntaxHighlighter>
          </motion.div>
        );

      case "list":
        return (
          <motion.ul
            key={index}
            className="list-disc pl-6 mb-6 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {(item.value as string[]).map((li: string, i: number) => (
              <li key={i}>{li}</li>
            ))}
          </motion.ul>
        );

      case "ordered-list":
        return (
          <motion.ol
            key={index}
            className="list-decimal pl-6 mb-6 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {(item.value as string[]).map((li: string, i: number) => (
              <li key={i}>{li}</li>
            ))}
          </motion.ol>
        );

      case "blockquote":
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
