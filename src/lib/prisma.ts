import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

console.log('PRISMA_DEBUG: Module loading started');

const globalForPrisma = global as unknown as { prisma: any };

// Simple build check
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
console.log('PRISMA_DEBUG: isBuild =', isBuild);

function createPrismaClient() {
    if (isBuild) {
        console.log('PRISMA_DEBUG: Returning mock client for build');
        return new Proxy({}, { get: () => () => Promise.resolve([]) }) as any;
    }

    const dbUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
    console.log('PRISMA_DEBUG: URL present =', !!dbUrl);

    if (dbUrl && (dbUrl.startsWith('prisma://') || dbUrl.startsWith('prisma+postgres://'))) {
        console.log('PRISMA_DEBUG: Using Accelerate path');
        return new PrismaClient({
            datasourceUrl: dbUrl,
        } as any).$extends(withAccelerate());
    }

    console.log('PRISMA_DEBUG: Using default path');
    return new PrismaClient();
}

console.log('PRISMA_DEBUG: Calling createPrismaClient');
export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production' || isBuild) globalForPrisma.prisma = prisma;
console.log('PRISMA_DEBUG: Module loading complete');
