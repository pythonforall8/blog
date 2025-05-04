import { Post, Author, Category } from '@/types/blog';

// Sample authors
export const sampleAuthors: Author[] = [
  {
    slug: 'jyoti-sharma',
    name: 'Jyoti Sharma',
    title: 'Founder & Content Head',
    bio: 'Python educator with over 19 years of teaching experience, dedicated to making programming accessible to everyone.',
    avatar: '/jyoti-mam.png',
    social: {
      twitter: 'https://twitter.com/pythonforall',
      github: 'https://github.com/jyotiish',
      linkedin: 'https://www.linkedin.com/in/jyoti-sharma-94296a199/'
    }
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
      linkedin: 'https://www.linkedin.com/in/sammyyakk/'
    }
  }
];

// Sample categories
export const sampleCategories: Category[] = [
  {
    slug: 'tutorials',
    name: 'Tutorials',
    description: 'Step-by-step guides to help you master Python programming'
  },
  {
    slug: 'data-science',
    name: 'Data Science',
    description: 'Articles about Python for data analysis, visualization, and machine learning'
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    description: 'Python frameworks and tools for building web applications'
  },
  {
    slug: 'tips-tricks',
    name: 'Tips & Tricks',
    description: 'Useful Python tips, best practices, and productivity hacks'
  },
  {
    slug: 'news',
    name: 'News',
    description: 'Latest updates from the Python community and ecosystem'
  }
];

// Sample blog posts
export const samplePosts: Post[] = [
  {
    slug: 'getting-started-with-python',
    title: 'Getting Started with Python: A Beginner\'s Guide',
    excerpt: 'Everything you need to know to begin your Python journey, from installation to writing your first program.',
    date: '2023-12-01',
    coverImage: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
    author: sampleAuthors[0],
    categories: [sampleCategories[0]],
    featured: true,
    readingTime: 8,
    content: [
      {
        type: 'paragraph',
        value: 'Python is one of the most popular programming languages in the world, known for its simplicity and versatility. Whether you\'re interested in web development, data science, artificial intelligence, or automation, Python is an excellent language to learn.'
      },
      {
        type: 'heading',
        value: 'Installing Python',
        level: 2
      },
      {
        type: 'paragraph',
        value: 'The first step is to install Python on your computer. Visit the official Python website (python.org) and download the latest version for your operating system.'
      },
      {
        type: 'code',
        value: '# Check your Python version\npython --version',
        language: 'bash'
      },
      {
        type: 'heading',
        value: 'Your First Python Program',
        level: 2
      },
      {
        type: 'paragraph',
        value: 'Let\'s start with the classic "Hello, World!" program to ensure everything is working correctly.'
      },
      {
        type: 'code',
        value: '# This is a comment\nprint("Hello, World!")',
        language: 'python'
      },
      {
        type: 'paragraph',
        value: 'When you run this code, you should see "Hello, World!" displayed in your console.'
      },
      {
        type: 'heading',
        value: 'Python Syntax Basics',
        level: 2
      },
      {
        type: 'paragraph',
        value: 'Python uses indentation to define code blocks, unlike many other programming languages that use braces {}. Here\'s a simple example:'
      },
      {
        type: 'code',
        value: 'if 5 > 2:\n    print("Five is greater than two!")\nelse:\n    print("Five is not greater than two!")',
        language: 'python'
      },
      {
        type: 'paragraph',
        value: 'This indentation is not just for readability – it\'s a requirement in Python and helps make the code cleaner.'
      }
    ]
  },
  {
    slug: 'data-visualization-with-matplotlib',
    title: 'Data Visualization with Matplotlib: From Basics to Advanced',
    excerpt: 'Learn how to create stunning visualizations in Python using the Matplotlib library.',
    date: '2023-11-15',
    coverImage: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg',
    author: sampleAuthors[1],
    categories: [sampleCategories[1], sampleCategories[0]],
    readingTime: 12,
    content: [
      {
        type: 'paragraph',
        value: 'Data visualization is a crucial skill for any data scientist or analyst. Matplotlib is one of the most popular Python libraries for creating static, animated, and interactive visualizations.'
      },
      {
        type: 'heading',
        value: 'Getting Started with Matplotlib',
        level: 2
      },
      {
        type: 'paragraph',
        value: 'First, you\'ll need to install Matplotlib using pip:'
      },
      {
        type: 'code',
        value: 'pip install matplotlib',
        language: 'bash'
      },
      {
        type: 'paragraph',
        value: 'Let\'s create a simple line plot to get started:'
      },
      {
        type: 'code',
        value: 'import matplotlib.pyplot as plt\nimport numpy as np\n\n# Create data\nx = np.linspace(0, 10, 100)\ny = np.sin(x)\n\n# Create plot\nplt.figure(figsize=(10, 6))\nplt.plot(x, y, label="sin(x)")\nplt.title("Simple Sine Wave")\nplt.xlabel("x")\nplt.ylabel("sin(x)")\nplt.legend()\nplt.grid(True)\nplt.show()',
        language: 'python'
      },
      {
        type: 'heading',
        value: 'Creating Different Types of Plots',
        level: 2
      },
      {
        type: 'paragraph',
        value: 'Matplotlib can create many different types of visualizations. Here are a few examples:'
      },
      {
        type: 'heading',
        value: 'Bar Chart',
        level: 3
      },
      {
        type: 'code',
        value: 'categories = ["Category A", "Category B", "Category C", "Category D"]\nvalues = [4, 7, 2, 5]\n\nplt.figure(figsize=(10, 6))\nplt.bar(categories, values, color="skyblue")\nplt.title("Simple Bar Chart")\nplt.xlabel("Categories")\nplt.ylabel("Values")\nplt.show()',
        language: 'python'
      },
      {
        type: 'heading',
        value: 'Scatter Plot',
        level: 3
      },
      {
        type: 'code',
        value: 'x = np.random.rand(100)\ny = np.random.rand(100)\ncolors = np.random.rand(100)\nsizes = 1000 * np.random.rand(100)\n\nplt.figure(figsize=(10, 6))\nplt.scatter(x, y, c=colors, s=sizes, alpha=0.5)\nplt.title("Scatter Plot with Random Data")\nplt.xlabel("X Values")\nplt.ylabel("Y Values")\nplt.colorbar(label="Color Values")\nplt.show()',
        language: 'python'
      }
    ]
  },
  {
    slug: 'python-for-web-scraping',
    title: 'Python for Web Scraping: A Practical Guide',
    excerpt: 'Learn how to extract data from websites using Python with BeautifulSoup and Requests libraries.',
    date: '2023-10-22',
    coverImage: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg',
    author: sampleAuthors[1],
    categories: [sampleCategories[0], sampleCategories[2]],
    readingTime: 10,
    content: [
      {
        type: 'paragraph',
        value: 'Web scraping is the process of extracting data from websites. Python is an excellent language for web scraping due to its simplicity and the availability of powerful libraries like BeautifulSoup and Requests.'
      },
      {
        type: 'heading',
        value: 'Setting Up Your Environment',
        level: 2
      },
      {
        type: 'paragraph',
        value: 'First, install the necessary libraries:'
      },
      {
        type: 'code',
        value: 'pip install requests beautifulsoup4',
        language: 'bash'
      },
      {
        type: 'heading',
        value: 'Basic Web Scraping with BeautifulSoup',
        level: 2
      },
      {
        type: 'paragraph',
        value: 'Let\'s start with a simple example: extracting all links from a webpage.'
      },
      {
        type: 'code',
        value: 'import requests\nfrom bs4 import BeautifulSoup\n\n# Send a GET request to the URL\nurl = "https://example.com"\nresponse = requests.get(url)\n\n# Parse the HTML content\nsoup = BeautifulSoup(response.text, "html.parser")\n\n# Find all links\nlinks = soup.find_all("a")\n\n# Print each link\'s href and text\nfor link in links:\n    print(f"Link: {link.get(\'href\')} - Text: {link.text.strip()}")',
        language: 'python'
      }
    ]
  },
  {
    slug: 'python-decorators-explained',
    title: 'Python Decorators Explained: Understanding Advanced Python Features',
    excerpt: 'Dive into Python decorators and learn how they can help you write cleaner, more maintainable code.',
    date: '2023-09-18',
    coverImage: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg',
    author: sampleAuthors[0],
    categories: [sampleCategories[0], sampleCategories[3]],
    readingTime: 15,
    content: [
      {
        type: 'paragraph',
        value: 'Decorators are one of Python\'s most powerful features, allowing you to modify the behavior of functions or methods without changing their source code. This concept follows Python\'s principle of "open for extension, closed for modification."'
      },
      {
        type: 'heading',
        value: 'Understanding Python Decorators',
        level: 2
      },
      {
        type: 'paragraph',
        value: 'At its core, a decorator is a function that takes another function as an argument and extends its behavior without explicitly modifying it.'
      },
      {
        type: 'code',
        value: 'def my_decorator(func):\n    def wrapper():\n        print("Something is happening before the function is called.")\n        func()\n        print("Something is happening after the function is called.")\n    return wrapper\n\n@my_decorator\ndef say_hello():\n    print("Hello!")\n\n# When you call say_hello()\nsay_hello()',
        language: 'python'
      },
      {
        type: 'paragraph',
        value: 'The output of this code would be:'
      },
      {
        type: 'code',
        value: 'Something is happening before the function is called.\nHello!\nSomething is happening after the function is called.',
        language: 'text'
      }
    ]
  },
  {
    slug: 'numpy-for-data-science',
    title: 'NumPy for Data Science: Essential Arrays and Operations',
    excerpt: 'Master NumPy, the fundamental package for scientific computing in Python, and boost your data science skills.',
    date: '2023-08-05',
    coverImage: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
    author: sampleAuthors[1],
    categories: [sampleCategories[1], sampleCategories[0]],
    readingTime: 14,
    content: [
      {
        type: 'paragraph',
        value: 'NumPy (Numerical Python) is the fundamental package for scientific computing in Python. It provides support for large, multi-dimensional arrays and matrices, along with a large collection of high-level mathematical functions to operate on these arrays.'
      },
      {
        type: 'heading',
        value: 'Getting Started with NumPy',
        level: 2
      },
      {
        type: 'paragraph',
        value: 'First, you\'ll need to install NumPy:'
      },
      {
        type: 'code',
        value: 'pip install numpy',
        language: 'bash'
      },
      {
        type: 'paragraph',
        value: 'Now, let\'s create some basic NumPy arrays:'
      },
      {
        type: 'code',
        value: 'import numpy as np\n\n# Create arrays\narr1 = np.array([1, 2, 3, 4, 5])\narr2 = np.zeros((3, 3))\narr3 = np.ones((2, 4))\narr4 = np.random.random((2, 2))\n\nprint("Array 1:", arr1)\nprint("Array 2:\\n", arr2)\nprint("Array 3:\\n", arr3)\nprint("Array 4:\\n", arr4)',
        language: 'python'
      }
    ]
  },
  {
    slug: 'python-generators-and-iterators',
    title: 'Python Generators and Iterators: The Power of Lazy Evaluation',
    excerpt: 'Learn about iterators and generators in Python and how they can help optimize memory usage in your programs.',
    date: '2023-07-12',
    coverImage: 'https://images.pexels.com/photos/7256634/pexels-photo-7256634.jpeg',
    author: sampleAuthors[0],
    categories: [sampleCategories[0], sampleCategories[3]],
    readingTime: 11,
    content: [
      {
        type: 'paragraph',
        value: 'Python\'s iterators and generators are powerful features that enable lazy evaluation, allowing you to work with large datasets efficiently without loading everything into memory at once.'
      },
      {
        type: 'heading',
        value: 'Understanding Iterators',
        level: 2
      },
      {
        type: 'paragraph',
        value: 'In Python, an iterator is an object that represents a stream of data, allowing you to traverse through all the elements.'
      },
      {
        type: 'code',
        value: '# Creating an iterator from a list\nmy_list = [1, 2, 3, 4, 5]\nmy_iterator = iter(my_list)\n\n# Iterating through the iterator\nprint(next(my_iterator))  # Output: 1\nprint(next(my_iterator))  # Output: 2\n\n# Using a for loop (which automatically calls next())\nfor item in iter(my_list):\n    print(item)',
        language: 'python'
      }
    ]
  }
];