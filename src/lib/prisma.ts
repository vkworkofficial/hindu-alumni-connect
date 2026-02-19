import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = global as unknown as { prisma: any };

// Check if we are in the build phase to avoid database connection errors during static analysis
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

function createPrismaClient() {
    // If we're in the build phase, return a proxy that mocks all Prisma methods
    if (isBuild) {
        console.log('Build phase detected: Returning mock Prisma client');
        return new Proxy({} as any, {
            get: (target, prop) => {
                return () => Promise.resolve([]);
            }
        });
    }

    const dbUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || '';
    const isAccelerate = dbUrl.startsWith('prisma://') || dbUrl.startsWith('prisma+postgres://');

    console.log(`Initializing Prisma Client. Accelerate: ${isAccelerate}, Using: ${dbUrl.split('@')[0]}...`);

    if (isAccelerate) {
        // For Accelerate, we pass the URL to the constructor and extend it.
        // If the standard constructor fails, we'll try a fallback in the next iteration.
        return new PrismaClient({
            datasourceUrl: dbUrl,
        }).$extends(withAccelerate());
    }

    // Standard connection
    return new PrismaClient();
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production' || isBuild) globalForPrisma.prisma = prisma;
