import { Post, Author, Category } from '@/types/blog';
import { getServerPosts, getServerAuthors, getServerCategories } from '@/lib/server-utils';

// Posts
export async function getPosts(): Promise<Post[]> {
  try {
    return getServerPosts();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const posts = getServerPosts();
    return posts.find(post => post.slug === slug);
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return undefined;
  }
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  try {
    const posts = getServerPosts();
    return posts.filter(post => 
      (post.categories ?? []).some(category => category.slug === categorySlug)
    );
  } catch (error) {
    console.error(`Error fetching posts for category ${categorySlug}:`, error);
    return [];
  }
}

export async function getPostsByAuthor(authorSlug: string): Promise<Post[]> {
  try {
    const posts = getServerPosts();
    return posts.filter(post => post.author?.slug === authorSlug);
  } catch (error) {
    console.error(`Error fetching posts for author ${authorSlug}:`, error);
    return [];
  }
}

export async function getRelatedPosts(post: Post | undefined, count: number = 3): Promise<Post[]> {
  try {
    if (!post || !post.slug) {
      return [];
    }
    
    const posts = getServerPosts();
    
    // Get posts with the same category, excluding the current post
    const sameCategoryPosts = posts.filter(p =>
      p.slug !== post.slug &&
      (p.categories ?? []).some(c1 => (post.categories ?? []).some(c2 => c1.slug === c2.slug))
    );

    // If we have enough posts with the same category, return them
    if (sameCategoryPosts.length >= count) {
      return sameCategoryPosts.slice(0, count);
    }

    // Otherwise, add some posts by the same author
    const sameAuthorPosts = posts.filter(p =>
      p.slug !== post.slug &&
      p.author?.slug === post.author?.slug &&
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
  } catch (error) {
    console.error(`Error fetching related posts for ${post?.slug}:`, error);
    return [];
  }
}

export async function searchPosts(query: string): Promise<Post[]> {
  try {
    const posts = getServerPosts();
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
        (post.categories ?? []).some(cat =>
          cat.name.toLowerCase().includes(normalizedQuery)
        )
      );
    });
  } catch (error) {
    console.error(`Error searching posts for "${query}":`, error);
    return [];
  }
}

// Categories
export async function getAllCategories(): Promise<(Category & { count: number })[]> {
  try {
    const categories = getServerCategories();
    const posts = getServerPosts();
    
    return categories.map(category => ({
      ...category,
      count: posts.filter(post => 
        (post.categories ?? []).some(c => c.slug === category.slug)
      ).length
    })).filter(category => category.count > 0); // Only return categories with at least one post
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoryInfo(slug: string): Promise<(Category & { count: number }) | undefined> {
  try {
    const categories = getServerCategories();
    const posts = getServerPosts();
    
    const category = categories.find(cat => cat.slug === slug);
    if (!category) return undefined;
    
    const count = posts.filter(post => 
      (post.categories ?? []).some(c => c.slug === slug)
    ).length;
    
    // Only return the category if it has at least one post
    return count > 0 ? { ...category, count } : undefined;
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return undefined;
  }
}

// Authors
export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
  try {
    const authors = getServerAuthors();
    return authors.find(author => author.slug === slug);
  } catch (error) {
    console.error(`Error fetching author ${slug}:`, error);
    return undefined;
  }
}

export async function getAllAuthors(): Promise<Author[]> {
  try {
    return getServerAuthors();
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}
