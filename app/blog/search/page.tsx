"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BlogHead } from "@/components/blog/blog-head";
import { PostGrid } from "@/components/blog/post-grid";
import { CategoryFilter } from "@/components/blog/category-filter";
import { BlogSearch } from "@/components/blog/blog-search";
import StarryBackground from "@/components/layout/starry";
import { FooterSection } from "@/components/layout/sections/footer";
import { Post } from "@/types/blog";
import { BlogHeader } from "@/components/blog/blog-header";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Use the API directly
        const apiResponse = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        const data = await apiResponse.json();

        if (data.results && Array.isArray(data.results)) {
          // Convert API results to Post objects we can display
          const displayPosts = data.results.map((item: any) => ({
            slug: item.slug,
            title: item.title,
            excerpt: item.excerpt || "No excerpt available",
            date: item.date || new Date().toISOString(),
            coverImage:
              item.coverImage ||
              "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg",
            author: {
              name: item.author?.name || "Unknown Author",
              slug: item.author?.slug || "unknown-author",
              title: item.author?.title || "",
              bio: item.author?.bio || "",
              avatar: item.author?.avatar || "",
            },
            categories: (item.categories || []).map((cat: string) => ({
              name: cat,
              slug: cat.toLowerCase().replace(/\s+/g, "-"),
              description: `Posts about ${cat}`,
            })),
            content: [],
            readingTime: item.readingTime || 5,
          }));

          setPosts(displayPosts);
        } else {
          console.warn("Invalid API response format:", data);
          setPosts([]);
        }
      } catch (error) {
        console.error("Error searching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-8">
          <BlogHeader />
        </div>
        <BlogHead
          title={`Search Results: ${query}`}
          subtitle={
            loading
              ? "Searching..."
              : `Found ${posts.length} ${
                  posts.length === 1 ? "article" : "articles"
                } for "${query}"`
          }
        />

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="w-full lg:w-3/4">
            {loading ? (
              <div className="p-12 text-center">
                <h3 className="text-xl mb-4">Searching...</h3>
              </div>
            ) : posts.length > 0 ? (
              <PostGrid posts={posts} />
            ) : (
              <div className="p-12 text-center">
                <h3 className="text-xl mb-4">
                  No articles found for &quot;{query}&quot;
                </h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords or browse our
                  categories.
                </p>
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/4 space-y-6">
            <BlogSearch initialQuery={query} />
            <CategoryFilter />
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
