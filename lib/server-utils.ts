import fs from 'fs';
import { Post, Author, Category } from '@/types/blog';

// Path to your data folder
const postsDirectory = `${process.cwd()}/data/blog`;
const authorsDirectory = `${process.cwd()}/data/authors`;
const categoriesDirectory = `${process.cwd()}/data/categories`;

// Read all posts, authors, and categories from their respective directories
export function readJSONFiles<T>(directory: string): T[] {
  try {
    if (!fs.existsSync(directory)) {
      console.warn(`Directory does not exist: ${directory}`);
      return [];
    }

    const files = fs.readdirSync(directory);
    return files
      .filter(file => file.endsWith('.json'))
      .map((file) => {
        try {
          const filePath = `${directory}/${file}`;
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          return JSON.parse(fileContent);
        } catch (error) {
          console.error(`Error reading file ${file}:`, error);
          return null;
        }
      })
      .filter((item): item is T => item !== null);
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

// Load posts, authors, and categories
export function getServerPosts(): Post[] {
  console.log('Reading posts from: ', postsDirectory);
  const posts = readJSONFiles<Post>(postsDirectory);
  console.log(`Found ${posts.length} posts.`);
  return posts;
}

export function getServerAuthors(): Author[] {
  console.log('Reading authors from: ', authorsDirectory);
  const authors = readJSONFiles<Author>(authorsDirectory);
  console.log(`Found ${authors.length} authors.`);
  return authors;
}

// Extract unique categories from all blog posts
export function getServerCategories(): Category[] {
  // First try to get categories from the categories directory
  console.log('Reading categories from: ', categoriesDirectory);
  const categoriesFromFiles = readJSONFiles<Category>(categoriesDirectory);
  console.log(`Found ${categoriesFromFiles.length} categories from files.`);
  
  // If we have categories in the directory, return them
  if (categoriesFromFiles.length > 0) {
    return categoriesFromFiles;
  }
  
  // Otherwise, extract categories from posts
  console.log('No categories found in directory, extracting from posts...');
  const posts = getServerPosts();
  const categoriesMap = new Map<string, Category>();
  
  posts.forEach(post => {
    if (!post.categories) {
      console.log(`Post ${post.slug} has no categories.`);
      return;
    }
    
    post.categories.forEach(category => {
      if (category && category.slug && !categoriesMap.has(category.slug)) {
        console.log(`Adding category from post: ${category.name} (${category.slug})`);
        categoriesMap.set(category.slug, {
          slug: category.slug,
          name: category.name,
          description: category.description || `Posts about ${category.name}`
        });
      }
    });
  });
  
  const extractedCategories = Array.from(categoriesMap.values());
  console.log(`Extracted ${extractedCategories.length} unique categories from posts.`);
  return extractedCategories;
} 