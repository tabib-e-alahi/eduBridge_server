import {
  config_default
} from "./chunk-Y6NVD232.mjs";

// src/lib/email.ts
import nodemailer from "nodemailer";
var generateHTML = (content, title) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; }
    .header { background: #1A8FE3; color: white; padding: 40px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 800; }
    .content { padding: 40px 30px; background: white; }
    .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888; }
    .button { display: inline-block; padding: 14px 28px; background: #1A8FE3; color: white !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .highlight { color: #1A8FE3; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EduBridge AI</h1>
    </div>
    <div class="content">
      <h2 style="margin-top: 0;">${title}</h2>
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} EduBridge AI. All rights reserved.</p>
      <p>Building the future of learning with AI.</p>
    </div>
  </div>
</body>
</html>
`;
var transporter = nodemailer.createTransport({
  host: config_default.EMAIL_HOST,
  port: Number(config_default.EMAIL_PORT),
  secure: config_default.EMAIL_PORT === 465,
  // true for 465, false for other ports
  auth: {
    user: config_default.EMAIL_USER,
    pass: config_default.EMAIL_PASS
  }
});
var sendEmail = async (to, subject, html) => {
  if (!config_default.EMAIL_USER || !config_default.EMAIL_PASS) {
    console.log("\n--- EMAIL SIMULATION (SMTP CREDENTIALS MISSING) ---");
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log("CONTENT: Check terminal for links below");
    console.log("--------------------------------------------------\n");
    return { messageId: "simulated-id" };
  }
  try {
    const info = await transporter.sendMail({
      from: `"EduBridge AI" <${config_default.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    return null;
  }
};
var EmailService = {
  async sendWelcomeEmail(to, name) {
    const title = "Welcome to EduBridge AI! \u{1F680}";
    const content = `
      <p>Hi <span class="highlight">${name}</span>,</p>
      <p>Welcome to EduBridge AI! We're thrilled to have you join our community of lifelong learners.</p>
      <p>EduBridge AI is designed to help you bridge the gap between where you are and where you want to be, using the power of Artificial Intelligence.</p>
      <p>Get started by exploring our courses or generating your first AI-powered learning path.</p>
      <a href="${config_default.FRONTEND_URL}/courses" class="button">Explore Courses</a>
    `;
    return sendEmail(to, title, generateHTML(content, title));
  },
  async sendVerificationEmail(to, token) {
    const title = "Verify Your Email";
    const verificationUrl = `${config_default.FRONTEND_URL}/verify-email?token=${token}`;
    console.log(`[EmailService] Verification Link for ${to}: ${verificationUrl}`);
    const content = `
      <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" class="button">Verify Email Address</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not create an account, you can safely ignore this email.</p>
    `;
    return sendEmail(to, title, generateHTML(content, title));
  },
  async sendEnrollmentConfirmation(to, name, courseTitle) {
    const title = "Enrollment Confirmed! \u{1F393}";
    const content = `
      <p>Hi <span class="highlight">${name}</span>,</p>
      <p>You have successfully enrolled in <span class="highlight">${courseTitle}</span>.</p>
      <p>Your journey to mastering this subject starts now. You can access the course materials from your dashboard anytime.</p>
      <a href="${config_default.FRONTEND_URL}/dashboard/user/courses" class="button">Go to My Courses</a>
    `;
    return sendEmail(to, title, generateHTML(content, title));
  },
  async sendAnnouncement(to, announcementTitle, message) {
    const title = "New Announcement";
    const content = `
      <p>${message}</p>
      <p>Best regards,<br/>The EduBridge AI Team</p>
    `;
    return sendEmail(to, announcementTitle, generateHTML(content, title));
  }
};
var email_default = EmailService;
export {
  email_default as default
};
