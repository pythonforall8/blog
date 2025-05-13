"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  ArrowRight,
  HistoryIcon,
  TrendingUpIcon,
  Loader2,
  Keyboard,
} from "lucide-react";
import { searchPosts } from "@/lib/blog";
import { Post } from "@/types/blog";
import { useKeyboardShortcuts } from "@/components/providers/keyboard-shortcut-provider";

interface SearchDialogProps {
  children: React.ReactNode;
}

export function SearchDialog({ children }: SearchDialogProps) {
  const { isSearchOpen, setIsSearchOpen } = useKeyboardShortcuts();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState<string[]>([
    "Python",
    "Machine Learning",
    "Data Science",
    "Programming Tips",
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSearches = localStorage.getItem("recentSearches");
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    }
  }, []);

  // Save search to recent searches
  const saveSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    if (typeof window !== "undefined") {
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
  };

  // Handle search submission
  const handleSearch = useCallback(
    (searchQuery: string = query) => {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        saveSearch(trimmedQuery);
        setIsSearchOpen(false);
        router.push(`/blog/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
    },
    [query, router, recentSearches, setIsSearchOpen]
  );

  // Handle direct article navigation
  const handleNavigateToArticle = useCallback(
    (slug: string, title: string) => {
      saveSearch(title);
      setIsSearchOpen(false);
      router.push(`/blog/${slug}`);
    },
    [router, setIsSearchOpen]
  );

  // Search for results as user types
  useEffect(() => {
    if (!isSearchOpen) return;

    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        console.log("Dialog searching for:", query);
        const posts = await searchPosts(query);
        console.log("Dialog search results:", posts.length);
        setResults(posts.slice(0, 8)); // Limit to 8 results
      } catch (error) {
        console.error("Error searching posts:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, isSearchOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Reset state when dialog is closed
  const handleOpenChange = (open: boolean) => {
    setIsSearchOpen(open);
    if (!open) {
      setQuery("");
      setResults([]);
    }
  };

  return (
    <Dialog open={isSearchOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={() => setIsSearchOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0" onKeyDown={handleKeyDown}>
        <Command className="rounded-lg border-none bg-background cmdk-root">
          <div className="flex items-center border-b px-3 cmdk-input-wrapper">
            <CommandInput
              placeholder="Search articles..."
              value={query}
              onValueChange={setQuery}
              className="flex-1 border-0 p-2 text-base focus:ring-0"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              <Keyboard className="h-3 w-3" />
              <span>ESC</span>
            </kbd>
          </div>
          <CommandList className="max-h-[500px] cmdk-list">
            {loading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {!loading && results.length > 0 && (
              <CommandGroup heading="Articles" className="cmdk-group">
                {results.map((post) => (
                  <CommandItem
                    key={post.slug}
                    onSelect={() =>
                      handleNavigateToArticle(post.slug, post.title)
                    }
                    className="cmdk-item"
                  >
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[400px]">
                          {post.excerpt}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-50" />
                    </div>
                  </CommandItem>
                ))}

                <CommandItem
                  onSelect={() => handleSearch()}
                  className="text-primary cmdk-item"
                >
                  <div className="flex items-center">
                    <span>View all results for "{query}"</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CommandItem>
              </CommandGroup>
            )}

            {!loading && query.trim().length > 1 && results.length === 0 && (
              <CommandEmpty>
                <p>No results found for "{query}"</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try searching with different keywords or browse our
                  categories.
                </p>
              </CommandEmpty>
            )}

            {(query.length < 2 || (!loading && results.length === 0)) && (
              <>
                {recentSearches.length > 0 && (
                  <>
                    <CommandGroup
                      heading="Recent Searches"
                      className="cmdk-group"
                    >
                      {recentSearches.map((term, index) => (
                        <CommandItem
                          key={`recent-${index}`}
                          onSelect={() => {
                            setQuery(term);
                            handleSearch(term);
                          }}
                          className="cmdk-item recent-item"
                          value={`recent-${term}-${index}`}
                        >
                          <HistoryIcon className="mr-2 h-4 w-4 opacity-50" />
                          <span>{term}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                  </>
                )}

                <CommandGroup heading="Popular Topics" className="cmdk-group">
                  {trendingSearches.map((term, index) => (
                    <CommandItem
                      key={`trend-${index}`}
                      onSelect={() => {
                        setQuery(term);
                        handleSearch(term);
                      }}
                      className="cmdk-item trending-item"
                      value={`trending-${term}-${index}`}
                    >
                      <TrendingUpIcon className="mr-2 h-4 w-4 opacity-50" />
                      <span>{term}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
