import { NextResponse } from 'next/server';
import { posts } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = posts.find(p => p.slug === params.slug);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const url = new URL(request.url);
    const count = parseInt(url.searchParams.get('count') || '3', 10);

    // Get posts with the same category, excluding the current post
    const sameCategoryPosts = posts.filter(p =>
      p.slug !== post.slug &&
      (p.categories ?? []).some(c1 => (post.categories ?? []).some(c2 => c1.slug === c2.slug))
    );

    // If we have enough posts with the same category, return them
    if (sameCategoryPosts.length >= count) {
      return NextResponse.json(sameCategoryPosts.slice(0, count));
    }

    // Otherwise, add some posts by the same author
    const sameAuthorPosts = posts.filter(p =>
      p.slug !== post.slug &&
      p.author.slug === post.author.slug &&
      !sameCategoryPosts.includes(p)
    );

    const relatedPosts = [...sameCategoryPosts, ...sameAuthorPosts];

    // If we still don't have enough, add some recent posts
    if (relatedPosts.length < count) {
      const otherPosts = posts.filter(p =>
        p.slug !== post.slug &&
        !relatedPosts.includes(p)
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return NextResponse.json([...relatedPosts, ...otherPosts].slice(0, count));
    }

    return NextResponse.json(relatedPosts.slice(0, count));
  } catch (error) {
    console.error(`Error reading related posts for ${params.slug}:`, error);
    return NextResponse.json({ error: 'Failed to load related posts' }, { status: 500 });
  }
} 