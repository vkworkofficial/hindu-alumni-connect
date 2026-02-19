import { PrismaClient } from '@prisma/client';
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
    console.log('Testing Production Prisma connection...');
    try {
        const count = await prisma.alumni.count();
        console.log('Success! Alumni count:', count);

        if (count > 0) {
            const first = await prisma.alumni.findFirst();
            console.log('Sample alumni:', first?.name);
        }
    } catch (err) {
        console.error('Prisma connection failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
