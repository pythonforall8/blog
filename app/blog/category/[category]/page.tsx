import React from 'react';
import { notFound } from 'next/navigation';
import { BlogHeader } from '@/components/blog/blog-header';
import { PostGrid } from '@/components/blog/post-grid';
import { CategoryFilter } from '@/components/blog/category-filter';
import { BlogSearch } from '@/components/blog/blog-search';
import StarryBackground from '@/components/layout/starry';
import { FooterSection } from '@/components/layout/sections/footer';
import { getPostsByCategory, getCategoryInfo } from '@/lib/blog';
import { Metadata } from 'next';

type Props = {
  params: {
    category: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryInfo = getCategoryInfo(params.category);
  
  if (!categoryInfo) {
    return {
      title: 'Category Not Found | Python For All Blog',
    };
  }

  return {
    title: `${categoryInfo.name} | Python For All Blog`,
    description: `Articles about ${categoryInfo.name.toLowerCase()} in Python programming.`,
  };
}

export default function CategoryPage({ params }: Props) {
  const categoryInfo = getCategoryInfo(params.category);
  
  if (!categoryInfo) {
    notFound();
  }
  
  const posts = getPostsByCategory(params.category);
  
  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <div className="container mx-auto px-4 py-12">
        <BlogHeader 
          title={categoryInfo.name} 
          subtitle={categoryInfo.description || `Articles related to ${categoryInfo.name} in Python programming`}
        />
        
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="w-full lg:w-3/4">
            {posts.length > 0 ? (
              <PostGrid posts={posts} />
            ) : (
              <div className="p-12 text-center">
                <h3 className="text-xl mb-4">No articles in this category yet.</h3>
                <p className="text-muted-foreground">
                  Check back soon for new content or explore other categories.
                </p>
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/4 space-y-6">
            <BlogSearch />
            <CategoryFilter activeCategory={params.category} />
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}