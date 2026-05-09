import {
  prisma
} from "./chunk-W7XWHOM4.mjs";

// src/modules/certificate/certificate.service.ts
import { randomBytes } from "crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
var generateCertificateNumber = () => {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const random = Math.floor(1e3 + Math.random() * 9e3);
  return `CERT-${year}-${random}`;
};
var generateVerificationHash = () => randomBytes(16).toString("hex");
var generateCertificatePdf = async (payload) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.98, 0.98, 0.99)
  });
  page.drawRectangle({
    x: 36,
    y: 36,
    width: width - 72,
    height: height - 72,
    borderWidth: 2,
    borderColor: rgb(0.15, 0.35, 0.95),
    color: rgb(1, 1, 1)
  });
  const centerX = width / 2;
  page.drawText("Certificate of Completion", {
    x: centerX - 220,
    y: height - 140,
    size: 36,
    font: fontBold,
    color: rgb(0.1, 0.12, 0.16)
  });
  page.drawText("This is to certify that", {
    x: centerX - 110,
    y: height - 200,
    size: 16,
    font,
    color: rgb(0.35, 0.4, 0.48)
  });
  page.drawText(payload.studentName || "Learner", {
    x: centerX - 200,
    y: height - 250,
    size: 34,
    font: fontBold,
    color: rgb(0.1, 0.12, 0.16)
  });
  page.drawText("has successfully completed the course", {
    x: centerX - 180,
    y: height - 300,
    size: 16,
    font,
    color: rgb(0.35, 0.4, 0.48)
  });
  page.drawText(`"${payload.courseTitle}"`, {
    x: 90,
    y: height - 350,
    size: 22,
    font: fontBold,
    color: rgb(0.15, 0.35, 0.95)
  });
  const issued = payload.issuedAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  page.drawText(`Certificate No: ${payload.certificateNumber}`, {
    x: 90,
    y: 90,
    size: 12,
    font,
    color: rgb(0.35, 0.4, 0.48)
  });
  page.drawText(`Issued: ${issued}`, {
    x: 90,
    y: 70,
    size: 12,
    font,
    color: rgb(0.35, 0.4, 0.48)
  });
  page.drawText(`Final Grade: ${payload.grade}%`, {
    x: width - 250,
    y: 70,
    size: 12,
    font,
    color: rgb(0.35, 0.4, 0.48)
  });
  return Buffer.from(await pdfDoc.save());
};
var issueCertificate = async (enrollmentId) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true, completionCriteria: true } },
      certificate: true
    }
  });
  if (!enrollment) throw new Error("Enrollment not found");
  if (enrollment.certificate) return enrollment.certificate;
  if (enrollment.progress < 100) throw new Error("Course not yet complete");
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: {
      userId: enrollment.userId,
      quiz: { courseId: enrollment.courseId }
    },
    orderBy: { createdAt: "desc" }
  });
  const avgScore = quizAttempts.length > 0 ? quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length : 85;
  let certificateNumber = generateCertificateNumber();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.certificate.findUnique({ where: { certificateNumber } });
    if (!exists) break;
    certificateNumber = generateCertificateNumber();
  }
  const verificationHash = generateVerificationHash();
  const certificate = await prisma.certificate.create({
    data: {
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      enrollmentId: enrollment.id,
      certificateNumber,
      verificationHash,
      grade: Number(avgScore.toFixed(1)),
      status: "ISSUED",
      metadataJson: {
        completionCriteria: enrollment.course.completionCriteria,
        quizAttempts: quizAttempts.length
      }
    }
  });
  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: "COMPLETED" }
  });
  const NotificationService = (await import("./notification.service-2CNJ7762.mjs")).default;
  NotificationService.notifyCertificateIssued(enrollment.userId, enrollment.course.title);
  return certificate;
};
var getUserCertificates = async (userId) => {
  const earned = await prisma.certificate.findMany({
    where: { userId, status: "ISSUED" },
    include: {
      course: {
        select: {
          title: true,
          instructor: { select: { name: true } },
          category: { select: { name: true } }
        }
      }
    },
    orderBy: { issuedAt: "desc" }
  });
  const inProgress = await prisma.enrollment.findMany({
    where: { userId, status: "ACTIVE", progress: { lt: 100 } },
    include: {
      course: { select: { title: true } },
      certificate: true
    },
    orderBy: { updatedAt: "desc" }
  });
  return { earned, inProgress };
};
var verifyCertificate = async (verificationHash) => {
  return prisma.certificate.findUnique({
    where: { verificationHash },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } }
    }
  });
};
var getCertificatePdf = async (certificateId) => {
  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: {
      user: { select: { name: true } },
      course: { select: { title: true } }
    }
  });
  if (!certificate) throw new Error("Certificate not found");
  const pdfBuffer = await generateCertificatePdf({
    studentName: certificate.user.name || "Learner",
    courseTitle: certificate.course.title,
    certificateNumber: certificate.certificateNumber,
    issuedAt: certificate.issuedAt,
    grade: certificate.grade
  });
  return { certificate, pdfBuffer };
};
var CertificateService = {
  issueCertificate,
  getUserCertificates,
  verifyCertificate,
  getCertificatePdf
};

export {
  CertificateService
};
