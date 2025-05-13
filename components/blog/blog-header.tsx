"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "./search-dialog";

export function BlogHeader() {
  return (
    <header className="mb-12 flex justify-between items-center">
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center text-primary hover:text-accent transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to all posts
        </Link>
      </div>
      <div>
        <SearchDialog>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
        </SearchDialog>
      </div>
    </header>
  );
}
