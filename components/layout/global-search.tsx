"use client";

import React from "react";
import { SearchDialog } from "@/components/blog/search-dialog";
import { useKeyboardShortcuts } from "@/components/providers/keyboard-shortcut-provider";
import { Command } from "lucide-react";

export function GlobalSearch() {
  const { openSearch } = useKeyboardShortcuts();

  return (
    <>
      <SearchDialog>
        <span className="fixed bottom-4 right-4 lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg">
          <Command className="h-5 w-5 text-primary-foreground" />
        </span>
      </SearchDialog>
    </>
  );
}
