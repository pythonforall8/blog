import { Post, Author, Category } from '@/types/blog';
import { samplePosts, sampleAuthors, sampleCategories } from '@/data/blog-sample-data';

// Posts
export function getPosts(): Post[] {
  return samplePosts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return samplePosts.find(post => post.slug === slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return samplePosts.filter(post => 
    post.categories.some(category => category.slug === categorySlug)
  );
}

export function getPostsByAuthor(authorSlug: string): Post[] {
  return samplePosts.filter(post => post.author.slug === authorSlug);
}

export function getRelatedPosts(post: Post, count: number = 3): Post[] {
  // Get posts with the same category, excluding the current post
  const sameCategoryPosts = samplePosts.filter(p => 
    p.slug !== post.slug && 
    p.categories.some(c1 => post.categories.some(c2 => c1.slug === c2.slug))
  );
  
  // If we have enough posts with the same category, return them
  if (sameCategoryPosts.length >= count) {
    return sameCategoryPosts.slice(0, count);
  }
  
  // Otherwise, add some posts by the same author
  const sameAuthorPosts = samplePosts.filter(p => 
    p.slug !== post.slug && 
    p.author.slug === post.author.slug &&
    !sameCategoryPosts.includes(p)
  );
  
  const relatedPosts = [...sameCategoryPosts, ...sameAuthorPosts];
  
  // If we still don't have enough, add some recent posts
  if (relatedPosts.length < count) {
    const otherPosts = samplePosts.filter(p => 
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
  
  return samplePosts.filter(post => {
    // Search in title, content, excerpt, categories
    return (
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.excerpt.toLowerCase().includes(normalizedQuery) ||
      post.content.some(block => 
        block.type === 'paragraph' && 
        block.value.toLowerCase().includes(normalizedQuery)
      ) ||
      post.categories.some(cat => 
        cat.name.toLowerCase().includes(normalizedQuery)
      )
    );
  });
}

// Categories
export function getAllCategories(): (Category & { count: number })[] {
  return sampleCategories.map(category => ({
    ...category,
    count: samplePosts.filter(post => 
      post.categories.some(c => c.slug === category.slug)
    ).length
  }));
}

export function getCategoryInfo(slug: string): (Category & { count: number }) | undefined {
  const category = sampleCategories.find(cat => cat.slug === slug);
  if (!category) return undefined;
  
  return {
    ...category,
    count: samplePosts.filter(post => 
      post.categories.some(c => c.slug === slug)
    ).length
  };
}

// Authors
export function getAuthorBySlug(slug: string): Author | undefined {
  return sampleAuthors.find(author => author.slug === slug);
}

export function getAllAuthors(): Author[] {
  return sampleAuthors;
}