import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { prisma } from '../../lib/prisma';
import { CertificateService } from './certificate.service';

const getMyCertificates = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id as string;
  const result = await CertificateService.getUserCertificates(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificates retrieved successfully',
    data: result,
  });
});

const issueCertificate = catchAsync(async (req: Request, res: Response) => {
  const enrollmentId = req.params.enrollmentId as string;
  const requester = (req as any).user as { id: string; role?: string };

  // Only allow issuing for self unless ADMIN
  if (requester.role !== 'ADMIN') {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: { userId: true },
    });
    if (!enrollment || enrollment.userId !== requester.id) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: 'You do not have permission to issue this certificate.',
      });
    }
  }

  const result = await CertificateService.issueCertificate(enrollmentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate issued successfully',
    data: result,
  });
});

const downloadCertificate = catchAsync(async (req: Request, res: Response) => {
  const certificateId = req.params.id as string;
  const requester = (req as any).user as { id: string; role?: string };

  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    select: { id: true, userId: true, certificateNumber: true },
  });

  if (!certificate) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'Certificate not found',
    });
  }

  if (requester.role !== 'ADMIN' && certificate.userId !== requester.id) {
    return res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: 'You do not have permission to download this certificate.',
    });
  }

  const { pdfBuffer } = await CertificateService.getCertificatePdf(certificateId);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${certificate.certificateNumber}.pdf"`
  );

  return res.status(httpStatus.OK).send(pdfBuffer);
});

const verifyCertificate = catchAsync(async (req: Request, res: Response) => {
  const verificationHash = req.params.verificationHash as string;
  const cert = await CertificateService.verifyCertificate(verificationHash);

  if (!cert) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'Certificate not found',
    });
  }

  const maskedEmail = cert.user.email
    ? cert.user.email.replace(/^(.)(.*)(@.*)$/, (_m, a, b, c) => `${a}${'*'.repeat(Math.min(6, String(b).length))}${c}`)
    : undefined;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate verified successfully',
    data: {
      certificateNumber: cert.certificateNumber,
      issuedAt: cert.issuedAt,
      status: cert.status,
      grade: cert.grade,
      student: { name: cert.user.name, email: maskedEmail },
      course: { title: cert.course.title },
    },
  });
});

export const CertificateController = {
  getMyCertificates,
  issueCertificate,
  downloadCertificate,
  verifyCertificate,
};

