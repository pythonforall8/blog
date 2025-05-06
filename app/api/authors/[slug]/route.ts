import { NextResponse } from 'next/server';
import { authors } from '@/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const author = authors.find(author => author.slug === params.slug);
    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }
    return NextResponse.json(author);
  } catch (error) {
    console.error('Error reading author:', error);
    return NextResponse.json({ error: 'Failed to load author' }, { status: 500 });
  }
} 