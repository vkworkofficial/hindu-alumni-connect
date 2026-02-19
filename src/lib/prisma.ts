import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
    const dbUrl = process.env.DATABASE_URL;

    // Simple initialization. Prisma will automatically use DATABASE_URL from environment
    // or Accelerate if the URL starts with prisma://
    return new PrismaClient();
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
