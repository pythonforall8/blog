import { NextResponse } from 'next/server';
import { getServerPosts } from '@/lib/server-utils';
import { Category } from '@/types/blog';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const posts = getServerPosts();
    
    // Find posts with this category
    const postsWithCategory = posts.filter(post => 
      post.categories && Array.isArray(post.categories) && 
      post.categories.some(c => c.slug === params.slug)
    );
    
    // If no posts found with this category
    if (postsWithCategory.length === 0) {
      return NextResponse.json({ error: 'Category not found or has no posts' }, { status: 404 });
    }
    
    // Extract the category data from the first post that has it
    const categoryData = postsWithCategory[0].categories.find(c => c.slug === params.slug);
    
    if (!categoryData) {
      return NextResponse.json({ error: 'Category data not found' }, { status: 404 });
    }
    
    // Create the category with count
    const categoryWithCount = {
      ...categoryData,
      count: postsWithCategory.length
    };

    return NextResponse.json(categoryWithCount);
  } catch (error) {
    console.error('Error reading category from posts:', error);
    return NextResponse.json({ error: 'Failed to load category' }, { status: 500 });
  }
} 