import { Post, Author, Category } from '@/types/blog';

// Functions
export async function getPosts(): Promise<Post[]> {
  const res = await fetch('/api/posts');
  return res.json();
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const res = await fetch(`/api/posts/${slug}`);
  if (!res.ok) return undefined;
  return res.json();
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const res = await fetch(`/api/categories/${categorySlug}/posts`);
  return res.json();
}

export async function getPostsByAuthor(authorSlug: string): Promise<Post[]> {
  const res = await fetch(`/api/authors/${authorSlug}/posts`);
  return res.json();
}

export async function getRelatedPosts(post: Post, count: number = 3): Promise<Post[]> {
  const res = await fetch(`/api/posts/${post.slug}/related?count=${count}`);
  return res.json();
}

export async function searchPosts(query: string): Promise<Post[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

// Categories
export async function getAllCategories(): Promise<(Category & { count: number })[]> {
  const res = await fetch('/api/categories');
  return res.json();
}

export async function getCategoryInfo(slug: string): Promise<(Category & { count: number }) | undefined> {
  const res = await fetch(`/api/categories/${slug}`);
  if (!res.ok) return undefined;
  return res.json();
}

// Authors
export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
  const res = await fetch(`/api/authors/${slug}`);
  if (!res.ok) return undefined;
  return res.json();
}

export async function getAllAuthors(): Promise<Author[]> {
  const res = await fetch('/api/authors');
  return res.json();
}
