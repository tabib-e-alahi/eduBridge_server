import { auth } from './src/lib/auth';

async function seedUsers() {
    console.log('Starting demo users seed...');
    
    const users = [
        { email: 'student@demo.com', password: 'password123', name: 'Demo Student' },
        { email: 'instructor@demo.com', password: 'password123', name: 'Demo Instructor' },
        { email: 'admin@demo.com', password: 'password123', name: 'Demo Admin' }
    ];

    for (const user of users) {
        try {
            await auth.api.signUpEmail({ body: user });
            console.log(`${user.name} created successfully.`);
        } catch (e: any) {
            console.log(`Failed to create ${user.name}:`, e.message || e);
        }
    }
    
    console.log('Seed finished.');
    process.exit(0);
}

seedUsers();
