"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Post } from "@/types/blog";

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Related Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(post.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
