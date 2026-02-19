import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = global as unknown as { prisma: any };

function createPrismaClient() {
    const dbUrl = process.env.DATABASE_URL || '';

    // Explicitly check for Accelerate patterns
    const isAccelerate = dbUrl.includes('prisma://') ||
        dbUrl.includes('prisma+postgres://') ||
        dbUrl.includes('db.prisma.io');

    const client = new PrismaClient();

    if (isAccelerate) {
        return client.$extends(withAccelerate());
    }

    return client;
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
