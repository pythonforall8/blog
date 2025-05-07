import { NextResponse } from 'next/server';
import { getServerPosts } from '@/lib/server-utils';
import { Category } from '@/types/blog';

export async function GET() {
  try {
    // Get all posts
    const posts = getServerPosts();
    
    // Extract unique categories from posts
    const categoriesMap = new Map<string, Category>();
    
    // Loop through all posts and collect unique categories
    posts.forEach(post => {
      if (!post.categories || !Array.isArray(post.categories)) {
        return;
      }
      
      post.categories.forEach(category => {
        if (category && category.slug && !categoriesMap.has(category.slug)) {
          categoriesMap.set(category.slug, {
            slug: category.slug,
            name: category.name,
            description: category.description || `Posts about ${category.name}`
          });
        }
      });
    });
    
    // Add count to each category
    const categoriesWithCount = Array.from(categoriesMap.values()).map(category => {
      const count = posts.filter(post => 
        post.categories && Array.isArray(post.categories) && 
        post.categories.some(c => c.slug === category.slug)
      ).length;
      
      return {
        ...category,
        count
      };
    });
    
    // Only return categories with at least one post
    const validCategories = categoriesWithCount.filter(cat => cat.count > 0);
    
    // Sort categories by name
    validCategories.sort((a, b) => a.name.localeCompare(b.name));
    
    return NextResponse.json(validCategories);
  } catch (error) {
    console.error('Error extracting categories from posts:', error);
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 });
  }
} 