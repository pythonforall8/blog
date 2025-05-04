import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Author } from '@/types/blog';
import { GithubIcon, LinkedInIcon, XIcon } from '@/components/icons';

interface AuthorProfileProps {
  author: Author;
}

export function AuthorProfile({ author }: AuthorProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">{author.name}</h2>
              <p className="text-muted-foreground mb-4">{author.title}</p>
              <div className="mb-6">
                <p className="text-lg">{author.bio}</p>
              </div>
              
              {author.social && (
                <div className="flex gap-4 justify-center md:justify-start">
                  {author.social.github && (
                    <a 
                      href={author.social.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      <GithubIcon />
                    </a>
                  )}
                  {author.social.twitter && (
                    <a 
                      href={author.social.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      <XIcon />
                    </a>
                  )}
                  {author.social.linkedin && (
                    <a 
                      href={author.social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      <LinkedInIcon />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}