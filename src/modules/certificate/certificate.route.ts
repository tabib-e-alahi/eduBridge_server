import { Router } from 'express';
import { requirePermission } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import { CertificateController } from './certificate.controller';

const router: Router = Router();

// Student/private
router.get('/my', requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), CertificateController.getMyCertificates);
router.post(
  '/issue/:enrollmentId',
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN),
  CertificateController.issueCertificate
);
router.get(
  '/:id/download',
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN),
  CertificateController.downloadCertificate
);

// Public verification
router.get('/verify/:verificationHash', CertificateController.verifyCertificate);

export const CertificateRoutes = router;

