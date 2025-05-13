import fs from 'fs';
import { Post, Author, Category } from '@/types/blog';

// Path to your data folder
const cwd = process.cwd();
const postsDirectory = `${cwd}/data/blog`;
const authorsDirectory = `${cwd}/data/authors`;
const categoriesDirectory = `${cwd}/data/categories`;

// Read all posts, authors, and categories from their respective directories
export function readJSONFiles<T>(directory: string): T[] {
  try {
    if (!fs.existsSync(directory)) {
      console.error(`Directory does not exist: ${directory}`);
      return [];
    }

    const files = fs.readdirSync(directory);
    console.log(`Reading ${files.length} files from directory: ${directory}`);
    
    const results = files
      .filter(file => file.endsWith('.json'))
      .map((file) => {
        try {
          const filePath = `${directory}/${file}`;
          console.log(`Reading file: ${filePath}`);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          
          try {
            const parsedContent = JSON.parse(fileContent);
            console.log(`Successfully parsed ${file}`);
            return parsedContent;
          } catch (parseError) {
            console.error(`Error parsing JSON in file ${file}:`, parseError);
            return null;
          }
        } catch (fileError) {
          console.error(`Error reading file ${file}:`, fileError);
          return null;
        }
      })
      .filter((item): item is T => item !== null);
    
    console.log(`Successfully read ${results.length} files out of ${files.length}`);
    return results;
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

// Load posts, authors, and categories
export function getServerPosts(): Post[] {
  try {
    // Debug: log current working directory and full path
    console.log('Current working directory:', process.cwd());
    console.log('Posts directory path:', postsDirectory);
    
    console.log('Reading posts from: ', postsDirectory);
    
    if (!fs.existsSync(postsDirectory)) {
      console.error(`Posts directory does not exist: ${postsDirectory}`);
      // Try to list parent directory to see what's available
      try {
        const parentDir = process.cwd();
        console.log(`Contents of parent directory (${parentDir}):`);
        console.log(fs.readdirSync(parentDir));
      } catch (err) {
        console.error('Failed to read parent directory:', err);
      }
      return [];
    }
    
    const files = fs.readdirSync(postsDirectory);
    console.log(`Found ${files.length} files in posts directory:`, files);
    
    const posts = readJSONFiles<Post>(postsDirectory);
    console.log(`Successfully parsed ${posts.length} posts.`);
    
    // Validate and prepare posts for search
    const validatedPosts = posts.map(validatePost).filter(Boolean) as Post[];
    console.log(`Validated ${validatedPosts.length} out of ${posts.length} posts`);
    
    if (validatedPosts.length === 0) {
      console.warn("No valid posts were found after validation.");
    } else {
      // Log the first post as a sample
      console.log("Sample post:", JSON.stringify(validatedPosts[0].title));
    }
    
    return validatedPosts;
  } catch (error) {
    console.error("Error in getServerPosts:", error);
    return [];
  }
}

// Function to validate and fix post structure if needed
function validatePost(post: Post | null): Post | null {
  if (!post) return null;
  
  try {
    // Check required fields
    if (!post.title || typeof post.title !== 'string') {
      console.warn(`Post missing title or invalid title: ${JSON.stringify(post.slug)}`);
      return null;
    }
    
    if (!post.slug || typeof post.slug !== 'string') {
      console.warn(`Post missing slug or invalid slug: ${post.title}`);
      return null;
    }
    
    // Ensure excerpt exists
    if (!post.excerpt || typeof post.excerpt !== 'string') {
      console.warn(`Post missing excerpt, adding default: ${post.slug}`);
      post.excerpt = `Article about ${post.title}`;
    }
    
    // Ensure date is valid
    if (!post.date) {
      console.warn(`Post missing date, adding default: ${post.slug}`);
      post.date = new Date().toISOString();
    }
    
    // Ensure content is properly structured
    if (typeof post.content === 'string') {
      console.log(`Converting string content to markdown block for: ${post.slug}`);
      // This is critical - we're converting string content to a properly formatted array
      post.content = [
        {
          type: 'markdown',
          value: post.content
        }
      ];
      
      // Debug log to verify the conversion
      console.log(`Content after conversion: type=${typeof post.content}, isArray=${Array.isArray(post.content)}, length=${(post.content as any[]).length}`);
    } else if (!post.content || !Array.isArray(post.content)) {
      console.warn(`Post has invalid content structure, fixing: ${post.slug}`);
      // Create minimal valid content
      post.content = [{
        type: 'paragraph',
        value: post.excerpt
      }];
    } else {
      // Ensure each content block has the right structure
      post.content = post.content.map(block => {
        // If the block doesn't have a type, default to paragraph
        if (!block.type) {
          block.type = 'paragraph';
        }
        
        // If we have a string value that looks like markdown and type isn't already 'markdown'
        if (typeof block.value === 'string' && 
            (block.value.includes('#') || block.value.includes('```')) && 
            block.type !== 'markdown') {
          block.type = 'markdown';
        }
        
        return block;
      });
    }
    
    // Ensure categories is an array
    if (!post.categories || !Array.isArray(post.categories)) {
      console.warn(`Post has invalid categories, fixing: ${post.slug}`);
      post.categories = [];
    }
    
    // Ensure readingTime exists
    if (!post.readingTime || typeof post.readingTime !== 'number') {
      console.warn(`Post missing readingTime, adding default: ${post.slug}`);
      // Estimate reading time based on content length
      const contentLength = post.content.reduce((total, block) => {
        if (typeof block.value === 'string') {
          return total + block.value.length;
        }
        if (Array.isArray(block.value)) {
          return total + block.value.join('').length;
        }
        return total;
      }, 0);
      
      // Average reading speed: ~200 words per minute, ~1000 characters per minute
      post.readingTime = Math.max(1, Math.ceil(contentLength / 1000));
    }
    
    return post;
  } catch (error) {
    console.error(`Error validating post ${post.slug || 'unknown'}:`, error);
    return null;
  }
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