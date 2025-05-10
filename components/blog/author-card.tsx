"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Author } from "@/types/blog";
import { GithubIcon, LinkedInIcon, XIcon } from "@/components/icons";

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
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">About the Author</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50">
              <Image
                src={author.avatar}
                alt={author.name}
                layout="fill"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{author.name}</h3>
              <p className="text-sm text-muted-foreground">{author.title}</p>
            </div>
          </div>

          <p className="text-sm">{author.bio}</p>

          {author.social &&
            Object.values(author.social).some((value) => value) && (
              <div className="flex gap-3">
                {author.social.twitter && (
                  <a
                    href={author.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <XIcon className="h-5 w-5" />
                  </a>
                )}
                {author.social.github && (
                  <a
                    href={author.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <GithubIcon className="h-5 w-5" />
                  </a>
                )}
                {author.social.linkedin && (
                  <a
                    href={author.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <LinkedInIcon className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}

          <div className="pt-2">
            <Button
              asChild
              variant="outline"
              className="w-full truncate hover:bg-primary hover:text-primary-foreground transition-colors blog-link"
            >
              <Link href={`/blog/author/${author.slug}`}>
                <span className="truncate block">
                  All posts by {author.name}
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
