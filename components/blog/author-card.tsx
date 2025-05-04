"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Author } from "@/types/blog";

interface AuthorCardProps {
  author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">About the Author</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{author.name}</h3>
              <p className="text-sm text-muted-foreground">{author.title}</p>
            </div>
          </div>

          <p className="text-sm">{author.bio}</p>

          <div className="pt-2">
            <Button asChild variant="outline" className="w-full">
              <Link href={`/blog/author/${author.slug}`}>
                View all posts by {author.name}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
