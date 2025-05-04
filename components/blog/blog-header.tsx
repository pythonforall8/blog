'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogHeaderProps {
  title: string;
  subtitle?: string;
}

export function BlogHeader({ title, subtitle }: BlogHeaderProps) {
  return (
    <header className="mb-12 text-center">
      <div className="mb-4">
        <Link href="/blog" className="inline-flex items-center text-primary hover:text-accent transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to all posts
        </Link>
      </div>
      <AnimatePresence>
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}
      </AnimatePresence>
    </header>
  );
}