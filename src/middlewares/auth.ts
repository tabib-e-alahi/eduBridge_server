import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { auth } from '../lib/auth';
import { prisma } from '../lib/prisma';
import catchAsync from '../utils/catchAsync';

const authMiddleware = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'You are not authorized!',
      });
    }

    const user = session.user;

    // DB re-validation to prevent stale session role escalation
    if (requiredRoles.length) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      });

      if (!dbUser || !requiredRoles.includes(dbUser.role)) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: 'You do not have permission to access this resource!',
        });
      }
    }

    (req as any).user = user;
    next();
  });
};

export default authMiddleware;
