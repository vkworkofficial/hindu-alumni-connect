import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = global as unknown as { prisma: any };

// Check if we are in the build phase to avoid database connection errors during static analysis
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

function createPrismaClient() {
    // If we're in the build phase, return a proxy that mocks all Prisma methods
    // to prevent any database connection attempts during static analysis.
    if (isBuild) {
        console.log('Build phase detected: Returning mock Prisma client');
        return new Proxy({} as any, {
            get: (target, prop) => {
                // Return a function that returns a promise of an empty array or object
                // to satisfy most Prisma queries during build-time analysis.
                return () => Promise.resolve([]);
            }
        });
    }

    const dbUrl = process.env.DATABASE_URL || '';

    // Explicitly check for Accelerate patterns (prisma:// protocol)
    const isAccelerate = dbUrl.startsWith('prisma://') || dbUrl.startsWith('prisma+postgres://');

    const client = new PrismaClient();

    if (isAccelerate) {
        return client.$extends(withAccelerate());
    }

    return client;
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production' || isBuild) globalForPrisma.prisma = prisma;
