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
  return readJSONFiles<Post>(postsDirectory);
}

export function getServerAuthors(): Author[] {
  return readJSONFiles<Author>(authorsDirectory);
}

export function getServerCategories(): Category[] {
  return readJSONFiles<Category>(categoriesDirectory);
} 