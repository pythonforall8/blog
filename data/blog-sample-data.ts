import fs from 'fs';
import path from 'path';

export type Author = {
  slug: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  social: {
    twitter: string;
    github: string;
    linkedin: string;
  };
};

export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Post = {
  slug: string;
  title: string;
  author: string;
  date: string;
  coverImage: string;
  tags: string[];
  description: string;
  content: string;
};

// Load posts from /data/blogs/*.json
const postsDir = path.join(process.cwd(), 'data/blogs');

export const posts: Post[] = fs.readdirSync(postsDir)
  .filter(file => file.endsWith('.json'))
  .map(file => {
    const filePath = path.join(postsDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents) as Post;
  });

// Static Authors
export const authors: Author[] = [
  {
    slug: 'jyoti-sharma',
    name: 'Jyoti Sharma',
    title: 'Founder & Content Head',
    bio: 'Python educator with over 19 years of teaching experience, dedicated to making programming accessible to everyone.',
    avatar: '/jyoti-mam.png',
    social: {
      twitter: 'https://twitter.com/pythonforall',
      github: 'https://github.com/jyotiish',
      linkedin: 'https://www.linkedin.com/in/jyoti-sharma-94296a199/',
    },
  },
  {
    slug: 'samyak-jain',
    name: 'Samyak Jain',
    title: 'Technical Head',
    bio: 'Full-stack developer and Python enthusiast focused on creating intuitive educational resources and tools.',
    avatar: '/samyak.jpg',
    social: {
      twitter: 'https://twitter.com/sammyyakk',
      github: 'https://github.com/sammyyakk',
      linkedin: 'https://www.linkedin.com/in/sammyyakk/',
    },
  },
];

// Static Categories
export const categories: Category[] = [
  {
    slug: 'tutorials',
    name: 'Tutorials',
    description: 'Step-by-step guides to help you master Python programming',
  },
  {
    slug: 'data-science',
    name: 'Data Science',
    description: 'Articles about Python for data analysis, visualization, and machine learning',
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    description: 'Python frameworks and tools for building web applications',
  },
  {
    slug: 'tips-tricks',
    name: 'Tips & Tricks',
    description: 'Useful Python tips, best practices, and productivity hacks',
  },
  {
    slug: 'news',
    name: 'News',
    description: 'Latest updates from the Python community and ecosystem',
  },
];
