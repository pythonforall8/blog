import { NextResponse } from 'next/server';
import { posts } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const categoryPosts = posts.filter(post =>
      (post.categories ?? []).some(category => category.slug === params.slug)
    );
    
    return NextResponse.json(categoryPosts);
  } catch (error) {
    console.error(`Error reading posts for category ${params.slug}:`, error);
    return NextResponse.json({ error: 'Failed to load category posts' }, { status: 500 });
  }
} 