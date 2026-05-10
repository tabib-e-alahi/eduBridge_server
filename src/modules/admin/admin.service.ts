import { prisma } from '../../lib/prisma';
import { Role } from '@prisma/client';

// ==========================================
// PRIVACY & MASKING UTILS
// ==========================================

const maskEmail = (email: string) => {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (!domain) return email;
  if (local.length <= 2) return `*@${domain}`;
  return `${local.substring(0, 2)}***@${domain}`;
};

const maskPhone = (phone?: string | null) => {
  if (!phone) return null;
  // Keep first 4 and last 3 characters
  if (phone.length <= 7) return '***';
  return `${phone.substring(0, 4)}******${phone.substring(phone.length - 3)}`;
};

const logAdminAction = async (adminId: string, action: string, entityType: string, entityId: string, metadata?: string, req?: any) => {
  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers['user-agent'] : null,
    }
  });
};

// Safe DTO Selectors (Never include password, tokens, or full addresses)
const safeUserSelect = {
  id: true,
  name: true,
  email: true, // Will be masked after retrieval
  role: true,
  status: true,
  image: true,
  createdAt: true,
  emailVerified: true,
  profile: {
    select: {
      phone: true, // Will be masked
      bio: true,
      // Exclude precise address
    }
  }
};

// ==========================================
// ADMIN METHODS
// ==========================================

const getSafeStudentsFromDB = async () => {
  const users = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: {
      ...safeUserSelect,
      _count: { select: { enrollments: true, quizAttempts: true } }
    },
    orderBy: { createdAt: 'desc' },
  });

  return users.map(user => ({
    ...user,
    email: maskEmail(user.email),
    profile: user.profile ? {
      ...user.profile,
      phone: maskPhone(user.profile.phone)
    } : null
  }));
};

const getSafeInstructorsFromDB = async () => {
  const users = await prisma.user.findMany({
    where: { role: { in: ['INSTRUCTOR', 'MANAGER'] } },
    select: {
      ...safeUserSelect,
      _count: { select: { enrollments: true } },
      mentorProfile: { select: { expertise: true, experience: true } }
    },
    orderBy: { createdAt: 'desc' },
  });

  return users.map(user => ({
    ...user,
    email: maskEmail(user.email),
    profile: user.profile ? {
      ...user.profile,
      phone: maskPhone(user.profile.phone)
    } : null
  }));
};

const updateUserRoleInDB = async (adminId: string, id: string, role: Role, req?: any) => {
  const result = await prisma.user.update({
    where: { id },
    data: { role },
    select: safeUserSelect,
  });

  await logAdminAction(adminId, 'UPDATE_ROLE', 'User', id, `Changed role to ${role}`, req);

  return { ...result, email: maskEmail(result.email) };
};

const updateUserStatusInDB = async (adminId: string, id: string, status: any, req?: any) => {
  const result = await prisma.user.update({
    where: { id },
    data: { status },
    select: safeUserSelect,
  });

  await logAdminAction(adminId, 'UPDATE_STATUS', 'User', id, `Changed status to ${status}`, req);

  return { ...result, email: maskEmail(result.email) };
};

const getPendingInstructorsFromDB = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: 'INSTRUCTOR',
      status: 'PENDING_APPROVAL'
    },
    select: safeUserSelect,
    orderBy: { createdAt: 'desc' }
  });

  return result.map(user => ({
    ...user,
    email: maskEmail(user.email)
  }));
};

// General functions
const getSystemSettingsFromDB = async () => {
  return await prisma.systemSetting.findMany();
};

const updateSystemSettingInDB = async (adminId: string, key: string, value: string, req?: any) => {
  const result = await prisma.systemSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  await logAdminAction(adminId, 'UPDATE_SETTING', 'SystemSetting', key, `Updated setting ${key}`, req);
  return result;
};

// --- Moderation & Reports ---

const getPlatformReportsFromDB = async () => {
  const result = await prisma.report.findMany({
    include: {
      reporter: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  return result.map(report => ({
    ...report,
    reporter: {
      ...report.reporter,
      email: maskEmail(report.reporter.email)
    }
  }));
};

const updateReportStatusInDB = async (adminId: string, id: string, status: any, req?: any) => {
  const result = await prisma.report.update({
    where: { id },
    data: { status },
  });

  await logAdminAction(adminId, 'UPDATE_REPORT_STATUS', 'Report', id, `Updated report status to ${status}`, req);

  return result;
};

// --- Audit Logs ---

const getAuditLogsFromDB = async () => {
  return await prisma.auditLog.findMany({
    include: {
      actor: { select: { id: true, name: true, role: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

// --- Courses Moderation ---

const getPendingCoursesFromDB = async () => {
  const result = await prisma.course.findMany({
    where: { status: 'IN_REVIEW' },
    include: {
      instructor: { select: { id: true, name: true, email: true, image: true } },
      category: true,
    },
    orderBy: { updatedAt: 'asc' },
  });

  return result.map(course => ({
    ...course,
    instructor: {
      ...course.instructor,
      email: maskEmail(course.instructor.email)
    }
  }));
};

const getAllCoursesFromDB = async () => {
  const result = await prisma.course.findMany({
    include: {
      instructor: { select: { id: true, name: true, email: true, image: true } },
      category: true,
      _count: { select: { enrollments: true, lessons: true } }
    },
    orderBy: { createdAt: 'desc' },
  });

  return result.map(course => ({
    ...course,
    instructor: {
      ...course.instructor,
      email: maskEmail(course.instructor.email)
    }
  }));
};

const updateCourseStatusInDB = async (adminId: string, id: string, status: any, req?: any) => {
  const result = await prisma.course.update({
    where: { id },
    data: { status },
  });

  await logAdminAction(adminId, 'UPDATE_COURSE_STATUS', 'Course', id, `Changed course status to ${status}`, req);

  return result;
};

export const AdminService = {
  getSafeStudentsFromDB,
  getSafeInstructorsFromDB,
  updateUserRoleInDB,
  updateUserStatusInDB,
  getPendingInstructorsFromDB,
  getSystemSettingsFromDB,
  updateSystemSettingInDB,
  getPlatformReportsFromDB,
  updateReportStatusInDB,
  getAuditLogsFromDB,
  getPendingCoursesFromDB,
  getAllCoursesFromDB,
  updateCourseStatusInDB,
};
