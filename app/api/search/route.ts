import { NextResponse } from 'next/server';
import { searchPosts } from '@/lib/blog';

export async function GET(request: Request) {
  try {
    // Extract search query from URL parameters
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('q') || '';
    
    console.log('API search request received for query:', searchQuery);
    
    // Execute search
    const results = await searchPosts(searchQuery);
    
    console.log(`API search returned ${results.length} results`);
    
    // Return search results with more complete data
    return NextResponse.json({
      query: searchQuery,
      count: results.length,
      results: results.map(post => ({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        date: post.date,
        coverImage: post.coverImage || "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg",
        readingTime: post.readingTime || 5,
        categories: post.categories?.map(c => c.name) || [],
        author: post.author ? {
          name: post.author.name,
          slug: post.author.slug,
          avatar: post.author.avatar
        } : null
      }))
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search posts', details: String(error) },
      { status: 500 }
    );
  }
} 