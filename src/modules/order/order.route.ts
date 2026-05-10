import express from 'express';
import { requirePermission } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import { OrderController } from './order.controller';

const router = express.Router();

router.post(
  '/create',
  requirePermission(PERMISSIONS.ENROLLMENT_CREATE),
  OrderController.createOrder
);

router.post(
  '/checkout',
  requirePermission(PERMISSIONS.ENROLLMENT_CREATE),
  OrderController.checkout
);

router.get(
  '/my-orders',
  requirePermission(PERMISSIONS.ORDER_VIEW_OWN),
  OrderController.getMyOrders
);

router.get(
  '/all',
  requirePermission(PERMISSIONS.ORDER_VIEW_ALL),
  OrderController.getAllOrders
);

export const OrderRoutes = router;
