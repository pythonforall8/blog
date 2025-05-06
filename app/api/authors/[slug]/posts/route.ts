import { NextResponse } from 'next/server';
import { posts } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const authorPosts = posts.filter(post => post.author.slug === params.slug);
    
    return NextResponse.json(authorPosts);
  } catch (error) {
    console.error(`Error reading posts for author ${params.slug}:`, error);
    return NextResponse.json({ error: 'Failed to load author posts' }, { status: 500 });
  }
} 