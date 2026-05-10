import { prisma } from '../../lib/prisma';
import { Report } from '@prisma/client';

const createSupportTicketInDB = async (payload: { reporterId?: string; name: string; email: string; subject: string; message: string }) => {
  // We'll store the extra info (name, email, subject) in the 'reason' or 'details' field as JSON
  const details = JSON.stringify({
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
  });

  const result = await prisma.report.create({
    data: {
      reporterId: payload.reporterId || '00000000-0000-0000-0000-000000000000', // System user or anonymous
      targetType: 'SUPPORT_TICKET',
      targetId: 'SYSTEM',
      reason: payload.message,
      status: 'OPEN',
    },
  });
  return result;
};

const getMySupportTicketsFromDB = async (userId: string) => {
  const result = await prisma.report.findMany({
    where: { reporterId: userId, targetType: 'SUPPORT_TICKET' },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

export const SupportService = {
  createSupportTicketInDB,
  getMySupportTicketsFromDB,
};
