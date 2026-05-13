// ===================================================================
// EduBridge AI — Database Seed Script
// Uses Better Auth signUpEmail for user creation so Account records
// are properly created alongside User records.
// ===================================================================

import { prisma } from '../lib/prisma';
import { auth } from '../lib/auth';
import { CourseStatus, Role } from '../../generated/prisma/enums';
import { getAdminUsers, demoUsers } from './data/users';
import { categoriesData } from './data/categories';
import { coursesData, blogData } from './data/courses';

// ─── Helper: Upsert a user via Better Auth ─────────────────────────
async function upsertUser(
  name: string,
  email: string,
  password: string,
  role: string,
) {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: role as Role, status: 'ACTIVE', emailVerified: true },
    });
    console.log(`  ✓ Updated existing user: ${email} → ${role}`);
    return existing;
  }

  // Sign up via Better Auth (creates User + Account records)
  try {
    await auth.api.signUpEmail({
      body: { name, email, password },
    });
  } catch (err: any) {
    // If signup fails (e.g. email verification issues), log and continue
    console.log(`  ⚠ signUpEmail note for ${email}:`, err?.message || err);
  }

  // Retrieve the created user and force the correct role + status
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`  ✗ Failed to create user: ${email}`);
    throw new Error(`User creation failed for ${email}`);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: role as Role, status: 'ACTIVE', emailVerified: true },
  });

  console.log(`  ✓ Created user: ${email} → ${role}`);
  return user;
}

// ─── Main Seed ──────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 Seeding database...\n');

  // ── 1. Seed Users ──────────────────────────────────────────────
  console.log('👤 Seeding users...');

  const adminUsers = getAdminUsers();
  const allUserDefs = [...adminUsers, ...demoUsers];

  const createdUsers: Record<string, any> = {};
  for (const u of allUserDefs) {
    const user = await upsertUser(u.name, u.email, u.password, u.role);
    createdUsers[u.email] = user;
  }

  // Collect instructors for course assignment
  const instructors = [
    createdUsers['john.doe@instructor.com'],
    createdUsers['jane.smith@instructor.com'],
  ];

  console.log(`  → ${Object.keys(createdUsers).length} users seeded.\n`);

  // ── 2. Seed Categories ─────────────────────────────────────────
  console.log('📂 Seeding categories...');

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.courseCategory.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  );

  console.log(`  → ${categories.length} categories seeded.\n`);

  // ── 3. Seed Mentor Profile ─────────────────────────────────────
  console.log('🎓 Seeding mentor profiles...');

  if (instructors[0]) {
    await prisma.mentor.upsert({
      where: { userId: instructors[0].id },
      update: {},
      create: {
        userId: instructors[0].id,
        expertise: ['Full Stack', 'Node.js', 'React', 'TypeScript'],
        experienceYears: 10,
        bio: 'Senior Software Engineer with 10+ years of experience. Passionate about teaching web technologies and mentoring junior developers.',
      },
    });
    console.log('  ✓ Mentor profile for John Doe');
  }

  if (instructors[1]) {
    await prisma.mentor.upsert({
      where: { userId: instructors[1].id },
      update: {},
      create: {
        userId: instructors[1].id,
        expertise: ['UI/UX', 'React', 'Marketing'],
        experienceYears: 7,
        bio: 'Creative developer and designer specializing in user experience, frontend development, and digital marketing strategies.',
      },
    });
    console.log('  ✓ Mentor profile for Jane Smith');
  }

  console.log('');

  // ── 4. Seed Courses with Lessons ───────────────────────────────
  console.log('📚 Seeding courses with lessons...');

  const courses = [];
  for (const courseData of coursesData) {
    const instructor = instructors[courseData.instructorIndex];
    const category = categories[courseData.categoryIndex];

    if (!instructor || !category) {
      console.log(`  ⚠ Skipping "${courseData.title}" — missing instructor or category`);
      continue;
    }

    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {},
      create: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        price: courseData.price,
        level: courseData.level,
        status: courseData.status as CourseStatus,
        instructorId: instructor.id,
        categoryId: category.id,
        lessons: {
          create: courseData.lessons.map((lesson, index) => ({
            title: lesson.title,
            slug: lesson.slug,
            content: lesson.content,
            duration: lesson.duration,
            videoUrl: lesson.videoUrl,
            order: index + 1,
          })),
        },
      },
    });

    courses.push(course);
    console.log(`  ✓ ${course.title} (${courseData.lessons.length} lessons)`);
  }

  console.log(`  → ${courses.length} courses seeded.\n`);

  // ── 5. Seed Blog ───────────────────────────────────────────────
  console.log('📝 Seeding blog...');

  if (instructors[0]) {
    await prisma.blog.upsert({
      where: { slug: blogData.slug },
      update: {},
      create: {
        title: blogData.title,
        slug: blogData.slug,
        content: blogData.content,
        authorId: instructors[0].id,
        isPublished: blogData.isPublished,
      },
    });
    console.log(`  ✓ "${blogData.title}"`);
  }

  console.log('\n✅ Seeding completed! 🌱\n');
}

// ─── Run ─────────────────────────────────────────────────────────────
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
