import { NextResponse } from 'next/server';
import { getServerPosts } from '@/lib/server-utils';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const posts = getServerPosts();
    
    // Find posts with this category
    const categoryPosts = posts.filter(post =>
      post.categories && Array.isArray(post.categories) && 
      post.categories.some(category => category.slug === params.slug)
    );
    
    // If no posts found for this category
    if (categoryPosts.length === 0) {
      return NextResponse.json({ error: 'No posts found for this category' }, { status: 404 });
    }
    
    return NextResponse.json(categoryPosts);
  } catch (error) {
    console.error(`Error reading posts for category ${params.slug}:`, error);
    return NextResponse.json({ error: 'Failed to load category posts' }, { status: 500 });
  }
} 