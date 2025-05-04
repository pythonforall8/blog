import fs from 'fs';
import path from 'path';
import { Post, Author, Category } from '@/types/blog';

// Path to your data folder
const postsDirectory = path.join(process.cwd(), 'data/blogs');
const authorsDirectory = path.join(process.cwd(), 'data/authors');
const categoriesDirectory = path.join(process.cwd(), 'data/categories');

// Read all posts, authors, and categories from their respective directories
const readJSONFiles = (directory: string) => {
  const files = fs.readdirSync(directory);
  return files.map((file) => {
    const filePath = path.join(directory, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  });
};

// Load posts, authors, and categories
export const posts: Post[] = readJSONFiles(postsDirectory);
export const authors: Author[] = readJSONFiles(authorsDirectory);
export const categories: Category[] = readJSONFiles(categoriesDirectory);

// Functions

// Posts
export function getPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(post => post.slug === slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return posts.filter(post => 
    post.categories.some(category => category.slug === categorySlug)
  );
}

export function getPostsByAuthor(authorSlug: string): Post[] {
  return posts.filter(post => post.author.slug === authorSlug);
}

export function getRelatedPosts(post: Post, count: number = 3): Post[] {
  // Get posts with the same category, excluding the current post
  const sameCategoryPosts = posts.filter(p => 
    p.slug !== post.slug && 
    p.categories.some(c1 => post.categories.some(c2 => c1.slug === c2.slug))
  );
  
  // If we have enough posts with the same category, return them
  if (sameCategoryPosts.length >= count) {
    return sameCategoryPosts.slice(0, count);
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
    
    return [...relatedPosts, ...otherPosts].slice(0, count);
  }
  
  return relatedPosts.slice(0, count);
}

export function searchPosts(query: string): Post[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) return [];
  
  return posts.filter(post => {
    // Search in title, content, excerpt, categories
    return (
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.excerpt.toLowerCase().includes(normalizedQuery) ||
      post.content.some(block => {
        // If block.value is a string, check if it contains the query
        if (typeof block.value === 'string') {
          return block.value.toLowerCase().includes(normalizedQuery);
        }
        // If block.value is an array of strings, check each string
        if (Array.isArray(block.value)) {
          return block.value.some(val => val.toLowerCase().includes(normalizedQuery));
        }
        return false;
      }) ||
      post.categories.some(cat => 
        cat.name.toLowerCase().includes(normalizedQuery)
      )
    );
  });
}


// Categories
export function getAllCategories(): (Category & { count: number })[] {
  return categories.map(category => ({
    ...category,
    count: posts.filter(post => 
      post.categories.some(c => c.slug === category.slug)
    ).length
  }));
}

export function getCategoryInfo(slug: string): (Category & { count: number }) | undefined {
  const category = categories.find(cat => cat.slug === slug);
  if (!category) return undefined;
  
  return {
    ...category,
    count: posts.filter(post => 
      post.categories.some(c => c.slug === slug)
    ).length
  };
}

// Authors
export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find(author => author.slug === slug);
}

export function getAllAuthors(): Author[] {
  return authors;
}
