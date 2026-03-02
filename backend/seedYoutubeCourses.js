const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./src/models/Course');
const User = require('./src/models/User');

dotenv.config();

const youtubeCourses = [
  {
    title: "Complete React JS Course - From Zero to Hero",
    description: "Learn React JS from scratch with this comprehensive course. This course covers React fundamentals, hooks, state management, and building real-world applications. Perfect for beginners who want to master modern frontend development.",
    thumbnail: "https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg",
    category: "Web Development",
    level: "beginner",
    price: 0,
    isPublished: true,
    tags: ["React", "JavaScript", "Frontend", "Web Development"],
    requirements: ["Basic HTML/CSS knowledge", "JavaScript fundamentals"],
    outcomes: ["Build React applications from scratch", "Understand React hooks", "Manage application state", "Create responsive UI components"],
    lessons: [
      {
        title: "Introduction to React",
        description: "What is React and why to use it",
        videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
        duration: 15,
        order: 1
      },
      {
        title: "Setting Up React Environment",
        description: "How to set up your development environment",
        videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0&t=300s",
        duration: 20,
        order: 2
      },
      {
        title: "React Components",
        description: "Understanding React components",
        videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0&t=600s",
        duration: 25,
        order: 3
      },
      {
        title: "React State and Props",
        description: "Managing state and props in React",
        videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0&t=900s",
        duration: 30,
        order: 4
      },
      {
        title: "React Hooks",
        description: "Learning React hooks in depth",
        videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0&t=1200s",
        duration: 35,
        order: 5
      }
    ]
  },
  {
    title: "Python for Beginners - Complete Course",
    description: "Start your programming journey with Python. This course covers Python basics, data types, control structures, functions, and object-oriented programming. Ideal for complete beginners.",
    thumbnail: "https://img.youtube.com/vi/_uQrJ0TkZlc/maxresdefault.jpg",
    category: "Programming",
    level: "beginner",
    price: 0,
    isPublished: true,
    tags: ["Python", "Programming", "Backend", "Data Science"],
    requirements: ["No programming experience needed", "Computer with internet"],
    outcomes: ["Write Python code confidently", "Understand programming concepts", "Build simple applications", "Prepare for advanced Python topics"],
    lessons: [
      {
        title: "Introduction to Python",
        description: "What is Python and why learn it",
        videoUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
        duration: 10,
        order: 1
      },
      {
        title: "Installing Python and Setting Up",
        description: "Get Python running on your computer",
        videoUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc&t=300s",
        duration: 15,
        order: 2
      },
      {
        title: "Variables and Data Types",
        description: "Understanding Python data types",
        videoUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc&t=600s",
        duration: 25,
        order: 3
      },
      {
        title: "Strings in Python",
        description: "Working with string data type",
        videoUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc&t=900s",
        duration: 20,
        order: 4
      },
      {
        title: "Lists and Tuples",
        description: "Collection data structures in Python",
        videoUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc&t=1200s",
        duration: 30,
        order: 5
      },
      {
        title: "Conditionals and Loops",
        description: "Control flow in Python",
        videoUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc&t=1500s",
        duration: 25,
        order: 6
      }
    ]
  },
  {
    title: "JavaScript Fundamentals - Complete Guide",
    description: "Master JavaScript with this comprehensive course. Learn variables, functions, objects, arrays, DOM manipulation, and ES6+ features. Build a strong foundation for web development.",
    thumbnail: "https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
    category: "Web Development",
    level: "beginner",
    price: 0,
    isPublished: true,
    tags: ["JavaScript", "Web Development", "Frontend", "Programming"],
    requirements: ["Basic computer skills", "Text editor installed"],
    outcomes: ["Write JavaScript code fluently", "Manipulate web pages with DOM", "Understand ES6+ features", "Build interactive websites"],
    lessons: [
      {
        title: "Introduction to JavaScript",
        description: "What is JavaScript and its role in web development",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        duration: 12,
        order: 1
      },
      {
        title: "Variables and Data Types",
        description: "Understanding JavaScript variables and types",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk&t=300s",
        duration: 20,
        order: 2
      },
      {
        title: "Operators in JavaScript",
        description: "Learn about different operators",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk&t=600s",
        duration: 18,
        order: 3
      },
      {
        title: "Functions",
        description: "Creating and using functions",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk&t=900s",
        duration: 25,
        order: 4
      },
      {
        title: "Objects",
        description: "Working with JavaScript objects",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk&t=1200s",
        duration: 30,
        order: 5
      },
      {
        title: "Arrays",
        description: "Array methods and operations",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk&t=1500s",
        duration: 28,
        order: 6
      }
    ]
  },
  {
    title: "Node.js and Express - Backend Development",
    description: "Learn backend development with Node.js and Express. This course covers server creation, RESTful APIs, middleware, authentication, and database integration.",
    thumbnail: "https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg",
    category: "Backend Development",
    level: "intermediate",
    price: 0,
    isPublished: true,
    tags: ["Node.js", "Express", "Backend", "API", "JavaScript"],
    requirements: ["JavaScript knowledge", "Basic understanding of web"],
    outcomes: ["Build RESTful APIs", "Implement authentication", "Connect to databases", "Deploy Node.js applications"],
    lessons: [
      {
        title: "Introduction to Node.js",
        description: "What is Node.js and why use it",
        videoUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE",
        duration: 15,
        order: 1
      },
      {
        title: "Node.js Modules",
        description: "Understanding Node.js modules system",
        videoUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE&t=300s",
        duration: 20,
        order: 2
      },
      {
        title: "File System Operations",
        description: "Working with files in Node.js",
        videoUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE&t=600s",
        duration: 25,
        order: 3
      },
      {
        title: "Introduction to Express",
        description: "Setting up Express server",
        videoUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE&t=900s",
        duration: 22,
        order: 4
      },
      {
        title: "RESTful API Design",
        description: "Creating REST APIs with Express",
        videoUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE&t=1200s",
        duration: 30,
        order: 5
      }
    ]
  },
  {
    title: "HTML & CSS - Build Modern Websites",
    description: "Learn HTML and CSS to create beautiful websites. This course covers semantic HTML, CSS styling, flexbox, grid, and responsive design principles.",
    thumbnail: "https://img.youtube.com/vi/yfoY53QXEnI/maxresdefault.jpg",
    category: "Web Development",
    level: "beginner",
    price: 0,
    isPublished: true,
    tags: ["HTML", "CSS", "Web Development", "Frontend"],
    requirements: ["No prior experience needed", "Text editor"],
    outcomes: ["Create web pages with HTML", "Style websites with CSS", "Build responsive layouts", "Understand web design principles"],
    lessons: [
      {
        title: "Introduction to HTML",
        description: "What is HTML and its structure",
        videoUrl: "https://www.youtube.com/watch?v=yfoY53QXEnI",
        duration: 12,
        order: 1
      },
      {
        title: "HTML Tags and Elements",
        description: "Common HTML tags explained",
        videoUrl: "https://www.youtube.com/watch?v=yfoY53QXEnI&t=300s",
        duration: 20,
        order: 2
      },
      {
        title: "Introduction to CSS",
        description: "Styling your HTML with CSS",
        videoUrl: "https://www.youtube.com/watch?v=yfoY53QXEnI&t=600s",
        duration: 18,
        order: 3
      },
      {
        title: "CSS Selectors",
        description: "Targeting HTML elements with selectors",
        videoUrl: "https://www.youtube.com/watch?v=yfoY53QXEnI&t=900s",
        duration: 22,
        order: 4
      },
      {
        title: "Box Model",
        description: "Understanding CSS box model",
        videoUrl: "https://www.youtube.com/watch?v=yfoY53QXEnI&t=1200s",
        duration: 15,
        order: 5
      },
      {
        title: "Flexbox Layout",
        description: "Modern CSS layout with Flexbox",
        videoUrl: "https://www.youtube.com/watch?v=yfoY53QXEnI&t=1500s",
        duration: 25,
        order: 6
      }
    ]
  },
  {
    title: "Data Structures and Algorithms",
    description: "Master computer science fundamentals with this DSA course. Learn arrays, linked lists, trees, graphs, sorting, searching, and algorithm complexity analysis.",
    thumbnail: "https://img.youtube.com/vi/8hly31xKli0/maxresdefault.jpg",
    category: "Computer Science",
    level: "intermediate",
    price: 0,
    isPublished: true,
    tags: ["DSA", "Algorithms", "Programming", "Computer Science"],
    requirements: ["Basic programming knowledge", "Understanding of at least one language"],
    outcomes: ["Understand common data structures", "Implement sorting algorithms", "Solve coding problems efficiently", "Prepare for technical interviews"],
    lessons: [
      {
        title: "Introduction to Data Structures",
        description: "Why data structures matter",
        videoUrl: "https://www.youtube.com/watch?v=8hly31xKli0",
        duration: 10,
        order: 1
      },
      {
        title: "Arrays",
        description: "Understanding array operations",
        videoUrl: "https://www.youtube.com/watch?v=8hly31xKli0&t=300s",
        duration: 25,
        order: 2
      },
      {
        title: "Linked Lists",
        description: "Singly and doubly linked lists",
        videoUrl: "https://www.youtube.com/watch?v=8hly31xKli0&t=600s",
        duration: 30,
        order: 3
      },
      {
        title: "Stacks and Queues",
        description: "LIFO and FIFO data structures",
        videoUrl: "https://www.youtube.com/watch?v=8hly31xKli0&t=900s",
        duration: 25,
        order: 4
      },
      {
        title: "Binary Trees",
        description: "Tree data structure basics",
        videoUrl: "https://www.youtube.com/watch?v=8hly31xKli0&t=1200s",
        duration: 35,
        order: 5
      },
      {
        title: "Sorting Algorithms",
        description: "Bubble, selection, merge sort",
        videoUrl: "https://www.youtube.com/watch?v=8hly31xKli0&t=1500s",
        duration: 40,
        order: 6
      }
    ]
  },
  {
    title: "MongoDB - Complete Database Course",
    description: "Learn MongoDB from scratch. This course covers NoSQL concepts, CRUD operations, aggregation, indexing, and database design for modern applications.",
    thumbnail: "https://img.youtube.com/vi/c2M-rlkkT5o/maxresdefault.jpg",
    category: "Database",
    level: "intermediate",
    price: 0,
    isPublished: true,
    tags: ["MongoDB", "Database", "NoSQL", "Backend"],
    requirements: ["Basic programming knowledge", "Understanding of databases"],
    outcomes: ["Design MongoDB databases", "Perform CRUD operations", "Use aggregation pipeline", "Optimize database performance"],
    lessons: [
      {
        title: "Introduction to MongoDB",
        description: "What is MongoDB and NoSQL",
        videoUrl: "https://www.youtube.com/watch?v=c2M-rlkkT5o",
        duration: 12,
        order: 1
      },
      {
        title: "MongoDB Installation",
        description: "Setting up MongoDB locally",
        videoUrl: "https://www.youtube.com/watch?v=c2M-rlkkT5o&t=300s",
        duration: 15,
        order: 2
      },
      {
        title: "CRUD Operations",
        description: "Create, Read, Update, Delete",
        videoUrl: "https://www.youtube.com/watch?v=c2M-rlkkT5o&t=600s",
        duration: 30,
        order: 3
      },
      {
        title: "Data Modeling",
        description: "Designing MongoDB schemas",
        videoUrl: "https://www.youtube.com/watch?v=c2M-rlkkT5o&t=900s",
        duration: 25,
        order: 4
      },
      {
        title: "Aggregation Pipeline",
        description: "Advanced data processing",
        videoUrl: "https://www.youtube.com/watch?v=c2M-rlkkT5o&t=1200s",
        duration: 35,
        order: 5
      }
    ]
  },
  {
    title: "TypeScript - From Zero to Expert",
    description: "Master TypeScript for better JavaScript development. Learn types, interfaces, generics, decorators, and advanced TypeScript features for scalable applications.",
    thumbnail: "https://img.youtube.com/vi/BwuLxPH8IDs/maxresdefault.jpg",
    category: "Web Development",
    level: "intermediate",
    price: 0,
    isPublished: true,
    tags: ["TypeScript", "JavaScript", "Programming", "Web Development"],
    requirements: ["JavaScript knowledge", "Basic programming experience"],
    outcomes: ["Write type-safe code", "Use TypeScript features effectively", "Build scalable applications", "Improve code quality"],
    lessons: [
      {
        title: "Introduction to TypeScript",
        description: "Why TypeScript and setup",
        videoUrl: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
        duration: 15,
        order: 1
      },
      {
        title: "Type Annotations",
        description: "Basic types in TypeScript",
        videoUrl: "https://www.youtube.com/watch?v=BwuLxPH8IDs&t=300s",
        duration: 20,
        order: 2
      },
      {
        title: "Interfaces and Types",
        description: "Defining object shapes",
        videoUrl: "https://www.youtube.com/watch?v=BwuLxPH8IDs&t=600s",
        duration: 25,
        order: 3
      },
      {
        title: "Functions and Generics",
        description: "TypeScript functions and generics",
        videoUrl: "https://www.youtube.com/watch?v=BwuLxPH8IDs&t=900s",
        duration: 30,
        order: 4
      },
      {
        title: "Classes and Modules",
        description: "OOP in TypeScript",
        videoUrl: "https://www.youtube.com/watch?v=BwuLxPH8IDs&t=1200s",
        duration: 28,
        order: 5
      }
    ]
  }
];

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find or create an instructor
    let instructor = await User.findOne({ role: 'instructor' });
    
    if (!instructor) {
      instructor = await User.create({
        name: 'Kodnest Instructor',
        email: 'instructor@kodnest.com',
        password: 'instructor123',
        role: 'instructor'
      });
      console.log('Created default instructor');
    } else {
      console.log('Using existing instructor:', instructor.name);
    }

    // Clear existing courses (optional - remove if you want to keep existing)
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Add instructor to each course
    const coursesWithInstructor = youtubeCourses.map(course => ({
      ...course,
      instructor: instructor._id
    }));

    // Insert courses
    const courses = await Course.insertMany(coursesWithInstructor);
    console.log(`Successfully added ${courses.length} YouTube courses to the database`);

    courses.forEach(course => {
      console.log(`- ${course.title}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error.message);
    process.exit(1);
  }
};

seedCourses();
