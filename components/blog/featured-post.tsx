"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/types/blog";

const MotionWrapper = React.lazy(() => import("./motion-wrapper"));

interface FeaturedPostProps {
  post: Post;
}

// Helper function to safely format dates
const formatDate = (dateString: string): string => {
  try {
    // Try to parse as ISO date first
    return format(parseISO(dateString), "MMMM dd, yyyy");
  } catch (error) {
    try {
      // Fall back to regular Date constructor
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (error) {
      // If all else fails, return the original string
      console.error(`Error formatting date: ${dateString}`, error);
      return dateString;
    }
  }
};

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <Suspense fallback={<FeaturedPostContent post={post} />}>
      <MotionWrapper>
        <FeaturedPostContent post={post} />
      </MotionWrapper>
    </Suspense>
  );
}

function FeaturedPostContent({ post }: FeaturedPostProps) {
  return (
    <Card className="overflow-hidden border-2 hover:border-primary transition-all duration-300 group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative w-full h-72">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {post.categories && post.categories.length > 0 && (
            <div className="absolute top-4 left-4 flex gap-2">
              {post.categories.map((category) => (
                <Badge
                  key={category.slug}
                  variant="secondary"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{formatDate(post.date)}</span>
            <span>•</span>
            <span>{post.readingTime || "5"} min read</span>
          </div>
          <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-muted-foreground mb-4">{post.excerpt}</p>
          {post.author && (
            <div className="flex items-center gap-3">
              {post.author.avatar && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name || "Author"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {post.author.name && (
                <span className="font-medium">{post.author.name}</span>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
