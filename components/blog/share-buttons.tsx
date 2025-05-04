'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Facebook, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/blog/${slug}` 
    : `https://blog.pythonforall.com/blog/${slug}`;
  
  const shareText = `Check out this article: ${title}`;
  
  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };
  
  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };
  
  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank'
    );
  };
  
  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy', err);
      toast.error('Failed to copy link');
    });
  };
  
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Share this article</h3>
      <div className="flex flex-wrap gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={shareOnTwitter} 
            className="gap-2"
          >
            <Twitter className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">Twitter</span>
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={shareOnLinkedIn}
            className="gap-2"
          >
            <Linkedin className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">LinkedIn</span>
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={shareOnFacebook}
            className="gap-2"
          >
            <Facebook className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">Facebook</span>
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyLink}
            className="gap-2"
          >
            <Link2 className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">Copy Link</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}