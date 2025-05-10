export interface Author {
  slug: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface Category {
  slug: string;
  name: string;
  description?: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  author: Author;
  categories: Category[];
  content: {
    type: string;
    value: string | string[];
    language?: string;
    level?: number;
  }[];
  featured?: boolean;
  readingTime: number;
}