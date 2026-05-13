import { Message } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';


const sendMessageInDB = async (payload: Partial<Message>) => {
  const result = await prisma.message.create({
    data: payload as any,
  });
  return result;
};

const getMyConversationsFromDB = async (userId: string) => {
  // Get unique users who I have exchanged messages with
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
  });

  const conversations = new Map();
  messages.forEach((msg) => {
    const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
    if (!conversations.has(otherUser.id)) {
      conversations.set(otherUser.id, {
        user: otherUser,
        lastMessage: msg.content,
        createdAt: msg.createdAt,
      });
    }
  });

  return Array.from(conversations.values());
};

const getChatWithUserFromDB = async (userId: string, otherUserId: string) => {
  const result = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });

  // Mark messages as read
  await prisma.message.updateMany({
    where: { senderId: otherUserId, receiverId: userId, isRead: false },
    data: { isRead: true },
  });

  return result;
};

export const MessageService = {
  sendMessageInDB,
  getMyConversationsFromDB,
  getChatWithUserFromDB,
};
