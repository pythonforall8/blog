import React from "react";
import { notFound } from "next/navigation";
import { BlogHead } from "@/components/blog/blog-head";
import { PostGrid } from "@/components/blog/post-grid";
import StarryBackground from "@/components/layout/starry";
import { FooterSection } from "@/components/layout/sections/footer";
import { AuthorProfile } from "@/components/blog/author-profile";
import { getPostsByAuthor, getAuthorBySlug } from "@/lib/blog";
import { Metadata } from "next";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await getAuthorBySlug(params.slug);

  if (!author) {
    return {
      title: "Author Not Found | Python For All Blog",
    };
  }

  return {
    title: `${author.name} | Python For All Blog`,
    description: author.bio || `Articles by ${author.name}`,
  };
}

export default async function AuthorPage({ params }: Props) {
  const author = await getAuthorBySlug(params.slug);

  if (!author) {
    notFound();
  }

  const posts = await getPostsByAuthor(params.slug);

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <div className="container mx-auto px-4 py-12">
        <BlogHead
          title={`Author: ${author.name}`}
          subtitle={`${posts.length} ${
            posts.length === 1 ? "article" : "articles"
          }`}
        />

        <div className="mb-12">
          <AuthorProfile author={author} />
        </div>

        {posts.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">
              Articles by {author.name}
            </h2>
            <PostGrid posts={posts} />
          </div>
        ) : (
          <div className="p-12 text-center">
            <h3 className="text-xl mb-4">No articles by this author yet.</h3>
            <p className="text-muted-foreground">
              Check back soon for new content.
            </p>
          </div>
        )}
      </div>
      <FooterSection />
    </div>
  );
}
