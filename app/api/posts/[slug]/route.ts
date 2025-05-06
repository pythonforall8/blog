import { NextResponse } from 'next/server';
import { getServerPosts } from '@/lib/server-utils';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Get posts from the server
    const posts = getServerPosts();
    const post = posts.find((post) => post.slug === params.slug);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error reading post:', error);
    return NextResponse.json({ error: 'Failed to load post' }, { status: 500 });
  }
} 