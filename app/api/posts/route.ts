import { NextResponse } from 'next/server';
import { getServerPosts } from '@/lib/server-utils';

export async function GET() {
  try {
    // Get posts from the server
    const posts = getServerPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error reading posts:', error);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
} 