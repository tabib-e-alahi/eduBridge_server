import { Router } from 'express';
import { UserController } from './user.controller';
import { requirePermission, requireAuth } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';

const router: Router = Router();

// Must be before /:id to prevent 'me' from being treated as an id param
router.get('/me', requireAuth, UserController.getMyProfile);
router.patch('/me', requirePermission(PERMISSIONS.PROFILE_MANAGE), UserController.updateMyProfile);

router.get('/', requirePermission(PERMISSIONS.USER_VIEW), UserController.getAllUsers);
router.get('/:id', requirePermission(PERMISSIONS.USER_VIEW), UserController.getSingleUser);

export const UserRoutes = router;
