import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { auth } from '../lib/auth';
import { prisma } from '../lib/prisma';
import { hasAnyPermission, Permission } from '../config/permissions';
import catchAsync from '../utils/catchAsync';

/**
 * Permission-based middleware.
 * Validates that the authenticated user's role has the required permission(s).
 * At least ONE of the listed permissions must match.
 */
const requirePermission = (...requiredPermissions: Permission[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const user = session.user;

    // DB re-validation to prevent stale session role escalation
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (requiredPermissions.length && !hasAnyPermission(dbUser.role, requiredPermissions)) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    }

    (req as any).user = { ...user, role: dbUser.role };
    next();
  });
};

/**
 * Simple auth check — no specific permission required, just must be logged in.
 */
const requireAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  (req as any).user = session.user;
  next();
});

export { requirePermission, requireAuth };
