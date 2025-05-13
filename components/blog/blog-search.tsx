"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  HistoryIcon,
  TrendingUpIcon,
  Tag,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { searchPosts, getPostBySlug } from "@/lib/blog";
import { Post } from "@/types/blog";

interface BlogSearchProps {
  initialQuery?: string;
}

export function BlogSearch({ initialQuery = "" }: BlogSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Post[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState<string[]>([
    "Python",
    "Machine Learning",
    "Data Science",
    "Programming Tips",
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSearches = localStorage.getItem("recentSearches");
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5); // Keep only the 5 most recent searches

    setRecentSearches(updatedSearches);
    if (typeof window !== "undefined") {
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
  };

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        console.log("Fetching suggestions for:", query);

        // Use the API endpoint that's working correctly
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        if (
          data.results &&
          Array.isArray(data.results) &&
          data.results.length > 0
        ) {
          console.log("API suggestion results:", data.results.length);

          // Convert API results to full Post objects
          const fullPosts = await Promise.all(
            data.results.slice(0, 5).map(async (item: any) => {
              try {
                const post = await getPostBySlug(item.slug);
                return post;
              } catch (err) {
                console.error(
                  `Error fetching full post for ${item.slug}:`,
                  err
                );
                return null;
              }
            })
          );

          const validPosts = fullPosts.filter(Boolean) as Post[];
          setSuggestions(validPosts);
        } else {
          // Fall back to the direct function if API fails
          const results = await searchPosts(query);
          console.log("Direct suggestion results:", results.length);
          setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = useCallback(
    (searchQuery: string = query) => {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        saveSearch(trimmedQuery);
        setIsOpen(false);
        router.push(`/blog/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
    },
    [query, router, recentSearches, setIsOpen, saveSearch]
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSearch();
    },
    [handleSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleFormSubmit} className="flex gap-2 mb-2">
              <div className="relative flex-grow">
                <Input
                  placeholder="Search articles..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(e.target.value.length > 0);
                  }}
                  onFocus={() => setIsOpen(true)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow pr-10"
                />
                {query && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => {
                      setQuery("");
                      setIsOpen(false);
                    }}
                  >
                    <span className="sr-only">Clear</span>
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1">
                <Command className="rounded-lg border shadow-md bg-background cmdk-root">
                  <CommandList className="cmdk-list">
                    {suggestions.length > 0 && (
                      <CommandGroup
                        heading="Suggestions"
                        className="cmdk-group"
                      >
                        {suggestions.map((post) => (
                          <CommandItem
                            key={post.slug}
                            onSelect={() => {
                              router.push(`/blog/${post.slug}`);
                              setIsOpen(false);
                              saveSearch(post.title);
                            }}
                            className="cmdk-item"
                          >
                            <div className="flex items-center">
                              <span className="mr-2 text-sm flex-grow truncate">
                                {post.title}
                              </span>
                              <ArrowRight className="h-3 w-3 opacity-50" />
                            </div>
                          </CommandItem>
                        ))}
                        <CommandItem
                          onSelect={() => handleSearch()}
                          className="cmdk-item"
                        >
                          <div className="flex items-center text-primary">
                            <Search className="mr-2 h-4 w-4" />
                            <span>Search for &quot;{query}&quot;</span>
                          </div>
                        </CommandItem>
                      </CommandGroup>
                    )}

                    {loading && suggestions.length === 0 && (
                      <CommandGroup className="cmdk-group">
                        <div className="p-2 text-sm text-center text-muted-foreground">
                          Searching...
                        </div>
                      </CommandGroup>
                    )}

                    {!loading &&
                      query.trim().length > 0 &&
                      suggestions.length === 0 && (
                        <CommandEmpty>
                          No articles found. Try a different search term.
                        </CommandEmpty>
                      )}

                    {recentSearches.length > 0 && (
                      <>
                        <CommandSeparator />
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
                      </>
                    )}

                    {trendingSearches.length > 0 && (
                      <>
                        <CommandSeparator />
                        <CommandGroup
                          heading="Popular Topics"
                          className="cmdk-group"
                        >
                          {trendingSearches.map((term, index) => (
                            <CommandItem
                              key={`trending-${index}`}
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
