import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Code2 } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Code2 className="h-6 w-6" />
            <span className="font-bold">Python For All</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/blog">
              <Button variant="ghost">Blog</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </nav>
  );
}