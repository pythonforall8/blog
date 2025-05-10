import React, { Suspense } from "react";
import { BlogHeader } from "@/components/blog/blog-header";
import { FeaturedPost } from "@/components/blog/featured-post";
import { PostGrid } from "@/components/blog/post-grid";
import { CategoryFilter } from "@/components/blog/category-filter";
import { BlogSearch } from "@/components/blog/blog-search";
import StarryBackground from "@/components/layout/starry";
import { FooterSection } from "@/components/layout/sections/footer";
import { getPosts } from "@/lib/blog";

async function BlogContent() {
  try {
    const posts = (await getPosts()) || [];

    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No posts found</h2>
          <p className="text-muted-foreground">
            Check back later for new content!
          </p>
        </div>
      );
    }

    const featuredPost = posts.find((post) => post.featured) || posts[0];
    const regularPosts = posts.filter((post) => post !== featuredPost);

    return (
      <>
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="w-full lg:w-2/3">
            <FeaturedPost post={featuredPost} />
          </div>
          <div className="w-full lg:w-1/3 space-y-6">
            <BlogSearch />
            <CategoryFilter />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-primary">
            Latest Articles
          </h2>
          <PostGrid posts={regularPosts} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error loading blog content:", error);
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Error loading blog content</h2>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }
}

export default function BlogPage() {
  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <div className="container mx-auto px-4 py-12">
        <BlogHeader
          title="Python For All Blog"
          subtitle="Insights, tutorials, and news about Python programming"
        />
        <Suspense
          fallback={
            <div className="py-12 text-center">Loading blog posts...</div>
          }
        >
          <BlogContent />
        </Suspense>
      </div>
      <FooterSection />
    </div>
  );
}
