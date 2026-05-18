import { Router } from 'express';
import { requirePermission } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import { BlogController } from './blog.controller';

const router: Router = Router();

router.get('/', BlogController.getAllBlogs);
router.get('/my-blogs', requirePermission(PERMISSIONS.BLOG_CREATE), BlogController.getMyBlogs);
router.get('/:slug', BlogController.getBlogBySlug);

router.post(
  '/',
  requirePermission(PERMISSIONS.BLOG_CREATE),
  BlogController.createBlog
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.BLOG_UPDATE),
  BlogController.updateBlog
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.BLOG_DELETE),
  BlogController.deleteBlog
);

export const BlogRoutes = router;
