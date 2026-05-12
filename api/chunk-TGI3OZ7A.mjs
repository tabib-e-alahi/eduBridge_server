// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
import { z } from "zod";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var envVarsSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000"),
  DATABASE_URL: z.string().describe("PostgreSQL connection string"),
  JWT_SECRET: z.string().describe("JWT secret key"),
  CORS_ORIGIN: z.string().default("*"),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string().describe("Cloudinary cloud name"),
  CLOUDINARY_API_KEY: z.string().describe("Cloudinary API key"),
  CLOUDINARY_API_SECRET: z.string().describe("Cloudinary API secret"),
  EMAIL_HOST: z.string().default("smtp.gmail.com"),
  EMAIL_PORT: z.string().default("587"),
  EMAIL_USER: z.string().optional().default(""),
  EMAIL_PASS: z.string().optional().default(""),
  FRONTEND_URL: z.string().default("http://localhost:3000")
});
var envVars = envVarsSchema.safeParse(process.env);
if (!envVars.success) {
  throw new Error(`Config validation error: ${envVars.error.message}`);
}
var envConfig = {
  ENV: envVars.data.NODE_ENV,
  PORT: envVars.data.PORT,
  DATABASE_URL: envVars.data.DATABASE_URL,
  JWT_SECRET: envVars.data.JWT_SECRET,
  CORS_ORIGIN: envVars.data.CORS_ORIGIN,
  BETTER_AUTH_SECRET: envVars.data.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: envVars.data.BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID: envVars.data.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: envVars.data.GOOGLE_CLIENT_SECRET,
  CLOUDINARY_CLOUD_NAME: envVars.data.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: envVars.data.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: envVars.data.CLOUDINARY_API_SECRET,
  EMAIL_HOST: envVars.data.EMAIL_HOST,
  EMAIL_PORT: envVars.data.EMAIL_PORT,
  EMAIL_USER: envVars.data.EMAIL_USER,
  EMAIL_PASS: envVars.data.EMAIL_PASS,
  FRONTEND_URL: envVars.data.FRONTEND_URL
};
var config_default = envConfig;

export {
  config_default
};
