import { NextResponse } from 'next/server';
import { authors } from '@/lib/mock-data';

export async function GET() {
  try {
    return NextResponse.json(authors);
  } catch (error) {
    console.error('Error reading authors:', error);
    return NextResponse.json({ error: 'Failed to load authors' }, { status: 500 });
  }
} 