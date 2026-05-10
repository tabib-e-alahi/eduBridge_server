import { User } from '../../../generated/prisma';
import { prisma } from '../../lib/prisma';

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    include: { profile: true },
  });
  return result;
};

const getMyProfileFromDB = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      profile: true,
    },
  });
  return result;
};

const updateMyProfileInDB = async (userId: string, payload: { name?: string; bio?: string; headline?: string }) => {
  // Update user name if provided
  if (payload.name) {
    await prisma.user.update({
      where: { id: userId },
      data: { name: payload.name },
    });
  }

  // Upsert profile data
  const profileData: any = {};
  if (payload.bio !== undefined) profileData.bio = payload.bio;
  if (payload.headline !== undefined) profileData.headline = payload.headline;

  if (Object.keys(profileData).length > 0) {
    await prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: { userId, ...profileData },
    });
  }

  return getMyProfileFromDB(userId);
};

export const UserService = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
};
