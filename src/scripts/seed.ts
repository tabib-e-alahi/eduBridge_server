import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { CourseStatus, Role } from '../../generated/prisma/index.js';

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 2. Seed Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@edubridge.ai' },
    update: {},
    create: {
      email: 'admin@edubridge.ai',
      name: 'Super Admin',
      role: Role.ADMIN,
      password: hashedPassword,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@edubridge.ai' },
    update: {},
    create: {
      email: 'manager@edubridge.ai',
      name: 'Content Manager',
      role: Role.MANAGER,
      password: hashedPassword,
    },
  });

  const instructors = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john.doe@instructor.com' },
      update: {},
      create: {
        email: 'john.doe@instructor.com',
        name: 'John Doe',
        role: Role.INSTRUCTOR,
        password: hashedPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane.smith@instructor.com' },
      update: {},
      create: {
        email: 'jane.smith@instructor.com',
        name: 'Jane Smith',
        role: Role.INSTRUCTOR,
        password: hashedPassword,
      },
    }),
  ]);

  const students = await Promise.all([
    prisma.user.upsert({
      where: { email: 'student1@gmail.com' },
      update: {},
      create: {
        email: 'student1@gmail.com',
        name: 'Alice Student',
        role: Role.STUDENT,
        password: hashedPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: 'student2@gmail.com' },
      update: {},
      create: {
        email: 'student2@gmail.com',
        name: 'Bob Student',
        role: Role.STUDENT,
        password: hashedPassword,
      },
    }),
  ]);

  // 3. Seed Categories
  const categoriesData = [
    { name: 'Full Stack Development', slug: 'full-stack-development', icon: 'monitor' },
    { name: 'Next.js & React', slug: 'nextjs-react', icon: 'layers' },
    { name: 'Node.js Backend', slug: 'nodejs-backend', icon: 'server' },
    { name: 'TypeScript', slug: 'typescript', icon: 'code' },
    { name: 'UI/UX Design', slug: 'ui-ux-design', icon: 'palette' },
    { name: 'Digital Marketing', slug: 'digital-marketing', icon: 'trending-up' },
    { name: 'Data Analysis', slug: 'data-analysis', icon: 'bar-chart' },
    { name: 'Career Development', slug: 'career-development', icon: 'briefcase' },
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.courseCategory.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  );

  // 4. Seed Mentors
  await prisma.mentor.upsert({
    where: { userId: instructors[0]!.id },
    update: {},
    create: {
      userId: instructors[0]!.id,
      expertise: ['Full Stack', 'Node.js', 'React'],
      experienceYears: 10,
      bio: 'Senior Software Engineer with a passion for teaching web technologies.',
    },
  });

  // 5. Seed Courses
  const coursesData: any[] = [
    {
      title: 'Ultimate Next.js 15 Mastery',
      slug: 'ultimate-nextjs-15-mastery',
      description: 'Master the latest features of Next.js 15 including App Router, Server Actions, and more.',
      price: 49.99,
      level: 'Intermediate',
      status: CourseStatus.PUBLISHED,
      instructorId: instructors[0]!.id,
      categoryId: categories[1]!.id,
    },
    {
      title: 'Node.js Advanced Patterns',
      slug: 'nodejs-advanced-patterns',
      description: 'Learn scalable architecture patterns for high-performance Node.js applications.',
      price: 59.99,
      level: 'Advanced',
      status: CourseStatus.PUBLISHED,
      instructorId: instructors[0]!.id,
      categoryId: categories[2]!.id,
    },
  ];

  for (let i = 0; i < 22; i++) {
    coursesData.push({
      title: `Course Title ${i + 3}`,
      slug: `course-title-${i + 3}`,
      description: `Description for course ${i + 3}. This is a comprehensive guide to mastering the subject.`,
      price: 19.99 + i * 5,
      level: i % 2 === 0 ? 'Beginner' : 'Intermediate',
      status: i < 22 ? CourseStatus.PUBLISHED : CourseStatus.DRAFT,
      instructorId: instructors[i % 2]!.id,
      categoryId: categories[i % 8]!.id,
    });
  }

  const courses = await Promise.all(
    coursesData.map((course) =>
      prisma.course.upsert({
        where: { slug: course.slug },
        update: {},
        create: course,
      })
    )
  );

  // 6. Seed Lessons
  for (const course of courses) {
    await prisma.lesson.upsert({
      where: { courseId_slug: { courseId: course.id, slug: 'introduction' } },
      update: {},
      create: {
        title: 'Introduction',
        slug: 'introduction',
        order: 1,
        courseId: course.id,
        content: 'Welcome to the course! In this lesson, we will cover the basics.',
      },
    });
  }

  // 7. Seed Blogs
  await prisma.blog.upsert({
    where: { slug: 'future-of-ai-in-education' },
    update: {},
    create: {
      title: 'The Future of AI in Education',
      slug: 'future-of-ai-in-education',
      content: 'AI is revolutionizing how we learn and teach...',
      authorId: instructors[0]!.id,
      isPublished: true,
    },
  });

  console.log('Seeding completed! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
