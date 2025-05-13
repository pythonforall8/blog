"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type KeyboardShortcutContextType = {
  openSearch: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
};

const KeyboardShortcutContext = createContext<
  KeyboardShortcutContextType | undefined
>(undefined);

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutContext);
  if (!context) {
    throw new Error(
      "useKeyboardShortcuts must be used within a KeyboardShortcutProvider"
    );
  }
  return context;
}

interface KeyboardShortcutProviderProps {
  children: React.ReactNode;
}

export function KeyboardShortcutProvider({
  children,
}: KeyboardShortcutProviderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <KeyboardShortcutContext.Provider
      value={{ openSearch, isSearchOpen, setIsSearchOpen }}
    >
      {children}
    </KeyboardShortcutContext.Provider>
  );
}
