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
import { BlogHeader } from "@/components/blog/blog-header";

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

// Helper function to prepare content for ArticleContent component
const prepareContent = (content: any): Block[] => {
  // If content is a string (from Decap CMS), convert it to a single block
  if (typeof content === "string") {
    return [
      {
        type: "markdown",
        value: content,
      },
    ];
  }

  // If content is already an array (from our sample data), process it
  if (Array.isArray(content)) {
    return content.map((block) => ({
      ...block,
      value: Array.isArray(block.value) ? block.value.join("\n") : block.value,
    }));
  }

  // Fallback for unexpected content format
  console.error("Unexpected content format:", content);
  return [{ type: "paragraph", value: "Content format error" }];
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <BlogHeader />
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readingTime || "5"} min read</span>
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

          <div className="flex flex-col-reverse lg:flex-row gap-8">
            <div className="lg:w-9/12">
              <ArticleContent content={prepareContent(post.content)} />
              <div className="mt-8">
                <ShareButtons title={post.title} slug={post.slug} />
              </div>
            </div>

            <aside className="lg:w-3/12 mb-8 lg:mb-0">
              <div className="sticky top-28 space-y-8">
                {post.author && <AuthorCard author={post.author} />}
                {relatedPosts.length > 0 && (
                  <RelatedPosts posts={relatedPosts} />
                )}
              </div>
            </aside>
          </div>
        </div>
      </article>
      <FooterSection />
    </div>
  );
}
