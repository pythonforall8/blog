import { Post, Author, Category } from '@/types/blog';

export const authors: Author[] = [
  {
    slug: 'john-doe',
    name: 'John Doe',
    title: 'Senior Python Developer',
    bio: 'Python enthusiast and software developer with 10 years of experience',
    avatar: '/authors/john-doe.jpg',
    social: {
      twitter: 'https://twitter.com/johndoe',
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe'
    }
  },
  {
    slug: 'jane-smith',
    name: 'Jane Smith',
    title: 'Python Data Scientist',
    bio: 'Machine learning expert and Python advocate',
    avatar: '/authors/jane-smith.jpg',
    social: {
      twitter: 'https://twitter.com/janesmith',
      github: 'https://github.com/janesmith',
      linkedin: 'https://linkedin.com/in/janesmith'
    }
  }
];

export const categories: Category[] = [
  {
    slug: 'python-basics',
    name: 'Python Basics',
    description: 'Fundamental concepts and tutorials for Python beginners'
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    description: 'Building web applications with Python frameworks'
  },
  {
    slug: 'data-science',
    name: 'Data Science',
    description: 'Python for data analysis, visualization and machine learning'
  }
];

export const posts: Post[] = [
  {
    slug: 'getting-started-with-python',
    title: 'Getting Started with Python',
    excerpt: 'Learn the basics of Python programming language and set up your development environment',
    date: '2023-10-15',
    coverImage: '/blog/python-basics.jpg',
    author: authors[0],
    categories: [categories[0]],
    content: [
      {
        type: 'paragraph',
        value: 'Python is one of the most popular programming languages in the world today...'
      },
      {
        type: 'code',
        value: 'print("Hello, World!")',
        language: 'python'
      }
    ],
    featured: true,
    readingTime: 5
  },
  {
    slug: 'python-web-frameworks',
    title: 'Comparing Python Web Frameworks',
    excerpt: 'An in-depth look at Django, Flask, and FastAPI for web development',
    date: '2023-11-02',
    coverImage: '/blog/web-frameworks.jpg',
    author: authors[0],
    categories: [categories[1]],
    content: [
      {
        type: 'paragraph',
        value: 'Python offers several excellent frameworks for web development...'
      }
    ],
    readingTime: 8
  },
  {
    slug: 'data-visualization-with-python',
    title: 'Data Visualization with Python',
    excerpt: 'Using Matplotlib, Seaborn, and Plotly to create stunning visualizations',
    date: '2023-12-05',
    coverImage: '/blog/data-viz.jpg',
    author: authors[1],
    categories: [categories[2]],
    content: [
      {
        type: 'paragraph',
        value: 'Data visualization is a crucial skill for any data scientist or analyst...'
      }
    ],
    readingTime: 10
  }
];

// Mock functions for blog.ts
export function mock_getPosts(): Post[] {
  return posts;
}

export function mock_getPostBySlug(slug: string): Post | undefined {
  return posts.find(post => post.slug === slug);
}

export function mock_getPostsByCategory(categorySlug: string): Post[] {
  return posts.filter(post => 
    (post.categories ?? []).some(category => category.slug === categorySlug)
  );
}

export function mock_getPostsByAuthor(authorSlug: string): Post[] {
  return posts.filter(post => post.author.slug === authorSlug);
}

export function mock_getRelatedPosts(post: Post | undefined, count: number = 3): Post[] {
  // Return empty array if post is undefined
  if (!post || !post.slug) {
    return [];
  }

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

export function mock_searchPosts(query: string): Post[] {
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
}

export function mock_getAllCategories(): (Category & { count: number })[] {
  return categories.map(category => ({
    ...category,
    count: posts.filter(post => 
      (post.categories ?? []).some(c => c.slug === category.slug)
    ).length
  }));
}

export function mock_getCategoryInfo(slug: string): (Category & { count: number }) | undefined {
  const category = categories.find(cat => cat.slug === slug);
  if (!category) return undefined;
  
  return {
    ...category,
    count: posts.filter(post => 
      (post.categories ?? []).some(c => c.slug === slug)
    ).length
  };
}

export function mock_getAuthorBySlug(slug: string): Author | undefined {
  return authors.find(author => author.slug === slug);
}

export function mock_getAllAuthors(): Author[] {
  return authors;
} 