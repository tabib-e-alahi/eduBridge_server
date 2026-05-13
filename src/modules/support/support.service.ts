import { prisma } from '../../lib/prisma';

const createSupportTicketInDB = async (payload: { reporterId?: string; name: string; email: string; subject: string; message: string }) => {
  // Store the extra info (name, email, subject) in the description field
  const details = JSON.stringify({
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
  });

  const result = await prisma.report.create({
    data: {
      reporterId: payload.reporterId ?? null,
      targetType: 'SUPPORT_TICKET',
      targetId: 'SYSTEM',
      reason: payload.message,
      description: details,
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
