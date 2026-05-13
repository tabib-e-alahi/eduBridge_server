// ===================================================================
// EduBridge AI — Seed Data: Courses with Lessons
// ===================================================================

interface LessonSeed {
  title: string;
  slug: string;
  content: string;
  duration: string;
  videoUrl: string;
}

interface CourseSeed {
  title: string;
  slug: string;
  description: string;
  price: number;
  level: string;
  status: string;
  instructorIndex: number;   // index into instructors array
  categoryIndex: number;     // index into categories array
  lessons: LessonSeed[];
}

export const coursesData: CourseSeed[] = [
  {
    title: 'Ultimate Next.js 15 Mastery',
    slug: 'ultimate-nextjs-15-mastery',
    description: 'Master the latest features of Next.js 15 including App Router, Server Actions, and more. Build production-ready apps from scratch.',
    price: 49.99,
    level: 'Intermediate',
    status: 'PUBLISHED',
    instructorIndex: 0,
    categoryIndex: 1,
    lessons: [
      { title: 'Introduction to Next.js 15', slug: 'introduction-to-nextjs-15', content: 'Welcome! In this lesson we cover the Next.js 15 ecosystem, project setup, and key differences from earlier versions.', duration: '25 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'App Router Deep Dive', slug: 'app-router-deep-dive', content: 'Explore the App Router architecture, file-based routing, layouts, loading states, and error boundaries.', duration: '40 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Server Components & Actions', slug: 'server-components-actions', content: 'Learn how React Server Components work inside Next.js and how to use Server Actions for mutations.', duration: '45 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Data Fetching Strategies', slug: 'data-fetching-strategies', content: 'Compare static generation, server-side rendering, and incremental static regeneration with real examples.', duration: '35 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Authentication & Authorization', slug: 'authentication-authorization', content: 'Implement secure authentication flows using middleware, sessions, and role-based access control.', duration: '50 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Deployment & Optimization', slug: 'deployment-optimization', content: 'Deploy to Vercel, optimize images, fonts, and bundles, and set up monitoring for production.', duration: '30 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
  },
  {
    title: 'Node.js Advanced Patterns',
    slug: 'nodejs-advanced-patterns',
    description: 'Learn scalable architecture patterns for high-performance Node.js applications. Covers microservices, event-driven design, and more.',
    price: 59.99,
    level: 'Advanced',
    status: 'PUBLISHED',
    instructorIndex: 0,
    categoryIndex: 2,
    lessons: [
      { title: 'Event Loop & Async Patterns', slug: 'event-loop-async-patterns', content: 'Understand the Node.js event loop, libuv, and advanced asynchronous patterns like async iterators.', duration: '45 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Microservices Architecture', slug: 'microservices-architecture', content: 'Design and implement microservices with message queues, API gateways, and service discovery.', duration: '55 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Database Design Patterns', slug: 'database-design-patterns', content: 'Master repository pattern, unit of work, CQRS, and connection pooling for production databases.', duration: '40 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Caching Strategies', slug: 'caching-strategies', content: 'Implement in-memory caching, Redis integration, cache invalidation, and CDN strategies.', duration: '35 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Error Handling & Logging', slug: 'error-handling-logging', content: 'Build robust error handling with custom error classes, structured logging, and distributed tracing.', duration: '30 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
  },
  {
    title: 'TypeScript Deep Dive',
    slug: 'typescript-deep-dive',
    description: 'Go beyond the basics of TypeScript. Learn advanced types, generics, decorators, and patterns for large-scale applications.',
    price: 39.99,
    level: 'Intermediate',
    status: 'PUBLISHED',
    instructorIndex: 0,
    categoryIndex: 3,
    lessons: [
      { title: 'Advanced Types & Generics', slug: 'advanced-types-generics', content: 'Master conditional types, mapped types, template literal types, and generic constraints.', duration: '50 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Type Guards & Narrowing', slug: 'type-guards-narrowing', content: 'Learn discriminated unions, user-defined type guards, assertion functions, and exhaustiveness checking.', duration: '35 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Decorators & Metadata', slug: 'decorators-metadata', content: 'Explore the decorator proposal, reflect-metadata, and building your own decorator library.', duration: '40 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Module System & Declaration Files', slug: 'module-system-declaration-files', content: 'Understand module resolution, declaration merging, ambient modules, and publishing typed libraries.', duration: '30 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
  },
  {
    title: 'React for Beginners',
    slug: 'react-for-beginners',
    description: 'Start your React journey from zero. Learn components, state, hooks, and build your first interactive web application.',
    price: 29.99,
    level: 'Beginner',
    status: 'PUBLISHED',
    instructorIndex: 1,
    categoryIndex: 1,
    lessons: [
      { title: 'React Fundamentals', slug: 'react-fundamentals', content: 'Set up your development environment, understand JSX, and create your first React component.', duration: '30 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Components & Props', slug: 'components-props', content: 'Learn to build reusable components, pass data with props, and compose complex UIs.', duration: '35 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'State Management with useState', slug: 'state-management-usestate', content: 'Manage component state, handle user input, and understand React re-rendering.', duration: '40 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Hooks in Depth', slug: 'hooks-in-depth', content: 'Master useEffect, useRef, useContext, useMemo, and useCallback for performant apps.', duration: '45 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Building Your First App', slug: 'building-your-first-app', content: 'Put it all together by building a task manager app with routing, state, and API integration.', duration: '60 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
  },
  {
    title: 'Full Stack Web Development Bootcamp',
    slug: 'full-stack-web-development-bootcamp',
    description: 'A comprehensive bootcamp covering HTML, CSS, JavaScript, React, Node.js, and databases. Go from zero to full-stack developer.',
    price: 79.99,
    level: 'Beginner',
    status: 'PUBLISHED',
    instructorIndex: 1,
    categoryIndex: 0,
    lessons: [
      { title: 'HTML & CSS Foundations', slug: 'html-css-foundations', content: 'Build semantic HTML pages and style them with modern CSS including Flexbox and Grid.', duration: '50 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'JavaScript Essentials', slug: 'javascript-essentials', content: 'Learn variables, functions, DOM manipulation, async/await, and ES6+ features.', duration: '55 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Frontend with React', slug: 'frontend-with-react', content: 'Build interactive frontends with React components, hooks, and client-side routing.', duration: '60 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Backend with Node.js & Express', slug: 'backend-with-nodejs-express', content: 'Create REST APIs, handle middleware, and connect to databases with Prisma.', duration: '55 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Database & Deployment', slug: 'database-deployment', content: 'Design PostgreSQL schemas, write migrations, and deploy your full-stack app.', duration: '45 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
  },
  {
    title: 'UI/UX Design Fundamentals',
    slug: 'ui-ux-design-fundamentals',
    description: 'Learn the principles of great user interface and experience design. Master wireframing, prototyping, and design systems.',
    price: 34.99,
    level: 'Beginner',
    status: 'PUBLISHED',
    instructorIndex: 0,
    categoryIndex: 4,
    lessons: [
      { title: 'Design Thinking Process', slug: 'design-thinking-process', content: 'Understand empathize, define, ideate, prototype, and test — the five stages of design thinking.', duration: '30 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Wireframing & Prototyping', slug: 'wireframing-prototyping', content: 'Create low-fidelity wireframes and interactive prototypes using industry-standard tools.', duration: '40 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Color Theory & Typography', slug: 'color-theory-typography', content: 'Choose effective color palettes, font pairings, and build visual hierarchy.', duration: '35 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Building Design Systems', slug: 'building-design-systems', content: 'Create reusable component libraries, tokens, and documentation for scalable design.', duration: '45 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
  },
  {
    title: 'Digital Marketing Masterclass',
    slug: 'digital-marketing-masterclass',
    description: 'Master online marketing strategies including SEO, content marketing, social media, paid ads, and analytics.',
    price: 44.99,
    level: 'Intermediate',
    status: 'PUBLISHED',
    instructorIndex: 1,
    categoryIndex: 5,
    lessons: [
      { title: 'SEO Fundamentals', slug: 'seo-fundamentals', content: 'Learn on-page SEO, keyword research, technical SEO, and link building strategies.', duration: '40 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Content Marketing Strategy', slug: 'content-marketing-strategy', content: 'Create a content calendar, write engaging blog posts, and measure content ROI.', duration: '35 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Social Media Marketing', slug: 'social-media-marketing', content: 'Build brand presence across platforms, create viral content, and engage communities.', duration: '40 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Paid Advertising', slug: 'paid-advertising', content: 'Run effective Google Ads and social media ad campaigns with proper targeting and budgeting.', duration: '45 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Analytics & Reporting', slug: 'analytics-reporting', content: 'Track KPIs with Google Analytics, build dashboards, and make data-driven decisions.', duration: '30 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
  },
  {
    title: 'Data Analysis with Python',
    slug: 'data-analysis-with-python',
    description: 'Learn to analyze and visualize data using Python, Pandas, and Matplotlib. From raw data to actionable insights.',
    price: 39.99,
    level: 'Beginner',
    status: 'PUBLISHED',
    instructorIndex: 0,
    categoryIndex: 6,
    lessons: [
      { title: 'Python for Data Analysis', slug: 'python-for-data-analysis', content: 'Set up your Python environment and learn essential syntax for data work.', duration: '35 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Pandas Essentials', slug: 'pandas-essentials', content: 'Load, clean, filter, and transform data using Pandas DataFrames.', duration: '45 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Data Visualization', slug: 'data-visualization', content: 'Create charts, graphs, and interactive plots with Matplotlib and Seaborn.', duration: '40 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Real-World Analysis Project', slug: 'real-world-analysis-project', content: 'Analyze a real dataset end-to-end: cleaning, exploration, visualization, and reporting.', duration: '60 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
  },
  {
    title: 'Career Growth Strategies',
    slug: 'career-growth-strategies',
    description: 'Practical strategies for career advancement in tech. Cover resume building, interview prep, networking, and personal branding.',
    price: 24.99,
    level: 'Beginner',
    status: 'PUBLISHED',
    instructorIndex: 1,
    categoryIndex: 7,
    lessons: [
      { title: 'Building a Strong Resume', slug: 'building-a-strong-resume', content: 'Craft an ATS-friendly resume that highlights your skills and experience effectively.', duration: '25 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Technical Interview Prep', slug: 'technical-interview-prep', content: 'Practice coding problems, system design questions, and behavioral interview techniques.', duration: '50 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Networking & Personal Branding', slug: 'networking-personal-branding', content: 'Build your online presence, contribute to open source, and grow your professional network.', duration: '30 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Salary Negotiation', slug: 'salary-negotiation', content: 'Research market rates, negotiate offers, and understand equity and benefits packages.', duration: '25 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
  },
  {
    title: 'Advanced CSS & Animations',
    slug: 'advanced-css-animations',
    description: 'Take your CSS skills to the next level with advanced layouts, custom properties, keyframe animations, and scroll-driven effects.',
    price: 34.99,
    level: 'Intermediate',
    status: 'PUBLISHED',
    instructorIndex: 0,
    categoryIndex: 0,
    lessons: [
      { title: 'CSS Custom Properties & Functions', slug: 'css-custom-properties-functions', content: 'Master CSS variables, calc(), clamp(), and modern CSS functions for dynamic styling.', duration: '35 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Advanced Grid & Subgrid', slug: 'advanced-grid-subgrid', content: 'Build complex responsive layouts with CSS Grid, subgrid, and container queries.', duration: '40 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Keyframe Animations', slug: 'keyframe-animations', content: 'Create smooth animations with @keyframes, timing functions, and animation composition.', duration: '35 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Scroll-Driven Animations', slug: 'scroll-driven-animations', content: 'Implement modern scroll-triggered animations using the Scroll Timeline API.', duration: '30 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
  },
];

export const blogData = {
  title: 'The Future of AI in Education',
  slug: 'future-of-ai-in-education',
  content: `Artificial Intelligence is fundamentally transforming how we learn and teach. From personalized learning paths to AI-powered tutoring, the education landscape is evolving at an unprecedented pace.\n\n## Key Trends\n\n1. **Adaptive Learning** — AI algorithms analyze student performance in real-time and adjust content difficulty, pacing, and style.\n2. **AI Tutoring** — Conversational AI provides 24/7 tutoring support, answering questions and explaining concepts.\n3. **Automated Assessment** — AI can grade assignments, provide feedback, and identify areas where students need help.\n4. **Content Generation** — AI tools help educators create course materials, quizzes, and learning resources faster.\n\nAt EduBridge AI, we are at the forefront of this revolution, combining cutting-edge AI with proven pedagogical methods to create the most effective learning experience possible.`,
  isPublished: true,
};
