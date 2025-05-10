"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function BlogHeader() {
  return (
    <header className="mb-12 text-center">
      <div className="mb-4">
        <Link
          href="/blog"
          className="inline-flex items-center text-primary hover:text-accent transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to all posts
        </Link>
      </div>
    </header>
  );
}
