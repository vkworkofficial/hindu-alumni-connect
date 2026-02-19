import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
    // If DATABASE_URL is a prisma:// URL, it might need accelerateUrl
    // If it's a postgres:// URL, standard initialization is usually fine
    // But since the generated client expects 1 arg, we provide an empty object as a base
    return new PrismaClient({} as any);
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
