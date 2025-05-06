"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BlogHeader } from "@/components/blog/blog-header";
import { PostGrid } from "@/components/blog/post-grid";
import { CategoryFilter } from "@/components/blog/category-filter";
import { BlogSearch } from "@/components/blog/blog-search";
import StarryBackground from "@/components/layout/starry";
import { FooterSection } from "@/components/layout/sections/footer";
import { searchPosts } from "@/lib/blog";
import { Post } from "@/types/blog"; // or wherever Post is defined

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const results = await searchPosts(query);
        setPosts(results);
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
        <BlogHeader
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
