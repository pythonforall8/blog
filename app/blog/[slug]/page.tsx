import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { Metadata } from "next";
import StarryBackground from "@/components/layout/starry";
import { FooterSection } from "@/components/layout/sections/footer";
import { ArticleContent } from "@/components/blog/article-content";
import { AuthorCard } from "@/components/blog/author-card";
import { ShareButtons } from "@/components/blog/share-buttons";
import { RelatedPosts } from "@/components/blog/related-posts";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog";

type Props = {
  params: {
    slug: string;
  };
};

type Block = {
  type: string;
  value: string;
  language?: string;
  level?: number;
};

// Helper function to safely format dates
const formatDate = (dateString: string): string => {
  try {
    // Try to parse as ISO date first
    return format(parseISO(dateString), "MMMM dd, yyyy");
  } catch (error) {
    try {
      // Fall back to regular Date constructor
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (error) {
      // If all else fails, return the original string
      console.error(`Error formatting date: ${dateString}`, error);
      return dateString;
    }
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found | Python For All Blog",
    };
  }

  return {
    title: `${post.title} | Python For All Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post, 3);

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="flex gap-8 flex-col lg:flex-row">
            <div className="lg:w-8/12">
              <ArticleContent
                content={post.content.map((block) => ({
                  ...block,
                  value: Array.isArray(block.value)
                    ? block.value.join("\n")
                    : block.value,
                }))}
              />
              <div className="mt-8">
                <ShareButtons title={post.title} slug={post.slug} />
              </div>
            </div>

            <aside className="lg:w-4/12 space-y-8">
              <AuthorCard author={post.author} />
              {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
            </aside>
          </div>
        </div>
      </article>
      <FooterSection />
    </div>
  );
}
