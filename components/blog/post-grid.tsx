"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/types/blog";

interface PostGridProps {
  posts: Post[];
}

export function PostGrid({ posts }: PostGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Default image for posts without cover image
  const defaultCoverImage =
    "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg";

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {posts.map((post) => (
        <motion.div key={post.slug} variants={item}>
          <Card className="h-full overflow-hidden border hover:border-primary transition-all duration-300 group blog-card">
            <Link
              href={`/blog/${post.slug}`}
              className="block h-full blog-link"
            >
              <div className="relative w-full h-48">
                <Image
                  src={post.coverImage || defaultCoverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {post.categories && post.categories.length > 0 && (
                  <div
                    className="absolute top-2 left-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href={`/blog/category/${post.categories[0].slug}`}
                      className="no-underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-background/80 backdrop-blur-sm hover:bg-background cursor-pointer"
                      >
                        {post.categories[0].name}
                      </Badge>
                    </Link>
                  </div>
                )}
              </div>
              <CardContent className="p-4 flex flex-col h-[calc(100%-12rem)]">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>
                    {format(new Date(post.date || new Date()), "MMM dd, yyyy")}
                  </span>
                  <span>•</span>
                  <span>{post.readingTime || "5"} min read</span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                  {post.excerpt || "No excerpt available"}
                </p>
                {post.author && (
                  <div
                    className="flex items-center gap-2 mt-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {post.author.avatar && (
                      <div className="relative w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name || "Author"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {post.author.name && (
                      <span className="text-xs font-medium">
                        {post.author.name}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Link>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
