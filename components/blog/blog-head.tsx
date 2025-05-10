"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogHeaderProps {
  title: string;
  subtitle?: string;
}

export function BlogHead({ title, subtitle }: BlogHeaderProps) {
  return (
    <header className="mb-12 text-center">
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
