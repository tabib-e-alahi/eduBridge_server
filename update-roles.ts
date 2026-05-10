import { prisma } from './src/lib/prisma';

async function updateRoles() {
    console.log('Updating demo roles...');
    try {
        await prisma.user.updateMany({
            where: { email: 'instructor@demo.com' },
            data: { role: 'INSTRUCTOR', status: 'ACTIVE' }
        });
        await prisma.user.updateMany({
            where: { email: 'admin@demo.com' },
            data: { role: 'ADMIN', status: 'ACTIVE' }
        });
        await prisma.user.updateMany({
            where: { email: 'student@demo.com' },
            data: { role: 'STUDENT', status: 'ACTIVE' }
        });
        console.log('Roles updated successfully.');
    } catch (e: any) {
        console.error('Failed to update roles:', e);
    }
    process.exit(0);
}

updateRoles();
