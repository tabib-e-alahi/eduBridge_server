// ===================================================================
// EduBridge AI — Seed Data: Users
// ===================================================================

import envConfig from '../../config/index.js';

export const getAdminUsers = () => [
  {
    name: envConfig.SUPER_ADMIN_NAME || 'Super Admin',
    email: envConfig.SUPER_ADMIN_EMAIL || 'superadmin@edubridge.ai',
    password: envConfig.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123',
    role: 'ADMIN',
  },
  {
    name: envConfig.ADMIN_NAME || 'Admin User',
    email: envConfig.ADMIN_EMAIL || 'admin@edubridge.ai',
    password: envConfig.ADMIN_PASSWORD || 'Admin@123',
    role: 'ADMIN',
  },
];

export const demoUsers = [
  {
    name: 'Content Manager',
    email: 'manager@edubridge.ai',
    password: 'Manager@123',
    role: 'MANAGER',
  },
  {
    name: 'John Doe',
    email: 'john.doe@instructor.com',
    password: 'Instructor@123',
    role: 'INSTRUCTOR',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@instructor.com',
    password: 'Instructor@123',
    role: 'INSTRUCTOR',
  },
  {
    name: 'Alice Student',
    email: 'student1@gmail.com',
    password: 'Student@123',
    role: 'STUDENT',
  },
  {
    name: 'Bob Student',
    email: 'student2@gmail.com',
    password: 'Student@123',
    role: 'STUDENT',
  },
];
