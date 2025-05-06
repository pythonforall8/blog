import { NextResponse } from 'next/server';
import { categories, posts } from '@/lib/mock-data';

export async function GET() {
  try {
    const categoriesWithCount = categories.map(category => ({
      ...category,
      count: posts.filter(post => 
        (post.categories ?? []).some(c => c.slug === category.slug)
      ).length
    }));
    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    console.error('Error reading categories:', error);
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 });
  }
} 