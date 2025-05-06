import { NextResponse } from 'next/server';
import { categories, posts } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const category = categories.find(cat => cat.slug === params.slug);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const categoryWithCount = {
      ...category,
      count: posts.filter(post => 
        (post.categories ?? []).some(c => c.slug === params.slug)
      ).length
    };

    return NextResponse.json(categoryWithCount);
  } catch (error) {
    console.error('Error reading category:', error);
    return NextResponse.json({ error: 'Failed to load category' }, { status: 500 });
  }
} 