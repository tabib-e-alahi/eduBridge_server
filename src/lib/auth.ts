import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import envConfig from "src/config";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, token }: { user: any; token: string }) => {
            const EmailService = (await import("./email")).default;
            await EmailService.sendPasswordResetEmail(user.email, token);
        },
    },
    emailVerification: {
        enabled: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, token }: { user: any; token: string }) => {
            const EmailService = (await import("./email")).default;
            await EmailService.sendVerificationEmail(user.email, token);
        },
    },
    socialProviders: {
        google: {
            clientId: envConfig.GOOGLE_CLIENT_ID,
            clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
        },
        // facebook: {
        //     clientId: envConfig.FACEBOOK_CLIENT_ID,
        //     clientSecret: envConfig.FACEBOOK_CLIENT_SECRET,
        // },
    },
    trustedOrigins: [envConfig.BETTER_AUTH_URL, envConfig.CORS_ORIGIN],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "STUDENT",
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    // Prevent self-assigning ADMIN
                    if (user.role === 'ADMIN') {
                        user.role = 'STUDENT';
                    }
                    
                    // Set status based on role
                    if (user.role === 'INSTRUCTOR' || user.role === 'MANAGER') {
                        user.status = 'PENDING_APPROVAL';
                    } else {
                        user.status = 'ACTIVE';
                    }

                    return { data: user };
                },
                after: async (user) => {
                    const EmailService = (await import("./email")).default;
                    await EmailService.sendWelcomeEmail(user.email, user.name || "Learner");
                },
            },
        },
    },
});
