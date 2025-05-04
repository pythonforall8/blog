'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getAllCategories } from '@/lib/blog';

interface CategoryFilterProps {
  activeCategory?: string;
}

export function CategoryFilter({ activeCategory }: CategoryFilterProps) {
  const pathname = usePathname();
  const isOnCategoryPage = pathname.includes('/blog/category/');
  const categories = getAllCategories();
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Categories</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1">
          <motion.div variants={itemVariants}>
            <Link 
              href="/blog"
              className={cn(
                "block px-3 py-2 rounded-md transition-colors hover:bg-muted",
                !isOnCategoryPage && "bg-muted font-medium text-primary"
              )}
            >
              All Posts
            </Link>
          </motion.div>
          {categories.map(category => (
            <motion.div key={category.slug} variants={itemVariants}>
              <Link 
                href={`/blog/category/${category.slug}`}
                className={cn(
                  "block px-3 py-2 rounded-md transition-colors hover:bg-muted",
                  activeCategory === category.slug && "bg-muted font-medium text-primary"
                )}
              >
                {category.name} ({category.count})
              </Link>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}