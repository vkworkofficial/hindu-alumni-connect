import { PrismaClient } from '@prisma/client';

console.log('PRISMA_DEBUG: Library module loaded - NO ACCELERATE - DEPLOY 002');

const globalForPrisma = global as unknown as { prisma: any };

const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

// Log environment status (safely)
const dbUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;

console.log('PRISMA_DEBUG: Environment Check:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- NEXT_PHASE: ${process.env.NEXT_PHASE}`);
console.log(`- isBuild: ${isBuild}`);
console.log(`- Database URL present: ${!!dbUrl}`);

function createPrismaClient() {
    if (isBuild) {
        console.log('PRISMA_DEBUG: Returning mock client for build phase');
        return new Proxy({}, { get: () => () => Promise.resolve([]) }) as any;
    }

    if (!dbUrl) {
        console.error('PRISMA_DEBUG: CRITICAL - No database URL found in environment variables!');
        return new PrismaClient();
    }

    try {
        console.log('PRISMA_DEBUG: Initializing STANDARD Prisma Client (No Accelerate)');
        // Just standard client
        return new PrismaClient();
    } catch (error) {
        console.error('PRISMA_DEBUG: Error constructing Prisma Client:', error);
        return new PrismaClient();
    }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production' || isBuild) globalForPrisma.prisma = prisma;
