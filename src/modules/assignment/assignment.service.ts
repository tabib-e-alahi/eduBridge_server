import { prisma } from '../../lib/prisma';
import { Assignment, AssignmentSubmission } from '@prisma/client';

const createAssignmentInDB = async (payload: Partial<Assignment>) => {
  const result = await prisma.assignment.create({
    data: payload as any,
  });
  return result;
};

const getCourseAssignmentsFromDB = async (courseId: string) => {
  const result = await prisma.assignment.findMany({
    where: { courseId },
    include: {
      _count: {
        select: { submissions: true },
      },
    },
  });
  return result;
};

const getUserAssignmentsFromDB = async (userId: string) => {
  // Find all assignments for courses the user is enrolled in
  const result = await prisma.assignment.findMany({
    where: {
      course: {
        enrollments: {
          some: {
            userId
          }
        }
      }
    },
    include: {
      course: {
        select: {
          title: true
        }
      },
      submissions: {
        where: {
          studentId: userId
        }
      }
    },
    orderBy: {
      dueDate: 'asc'
    }
  });
  return result;
};

const submitAssignmentToDB = async (payload: Partial<AssignmentSubmission>) => {
  const result = await prisma.assignmentSubmission.create({
    data: payload as any,
  });
  return result;
};

const getSubmissionsFromDB = async (assignmentId: string) => {
  const result = await prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: {
      student: {
        select: { id: true, name: true, email: true },
      },
    },
  });
  return result;
};

const gradeSubmissionInDB = async (id: string, payload: { grade: number; feedback?: string }) => {
  const result = await prisma.assignmentSubmission.update({
    where: { id },
    data: {
      grade: payload.grade,
      feedback: payload.feedback,
      status: 'GRADED',
    },
  });
  return result;
};

const getInstructorAssignmentsFromDB = async (instructorId: string) => {
  const result = await prisma.assignment.findMany({
    where: {
      course: {
        instructorId
      }
    },
    include: {
      course: {
        select: {
          title: true
        }
      },
      _count: {
        select: { submissions: true }
      },
      submissions: {
        where: {
          status: 'PENDING'
        },
        select: {
          id: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Map to include pending count more clearly
  return result.map(assignment => ({
    ...assignment,
    pendingCount: assignment.submissions.length,
    submissions: undefined // Hide the list of IDs
  }));
};

export const AssignmentService = {
  createAssignmentInDB,
  getCourseAssignmentsFromDB,
  getUserAssignmentsFromDB,
  getInstructorAssignmentsFromDB,
  submitAssignmentToDB,
  getSubmissionsFromDB,
  gradeSubmissionInDB,
};
