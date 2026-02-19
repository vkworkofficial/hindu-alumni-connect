import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = global as unknown as { prisma: any };

// Check if we are in the build phase to avoid database connection errors during static analysis
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

function createPrismaClient() {
    // If we're in the build phase, return a recursive proxy that mocks all Prisma methods
    if (isBuild) {
        console.log('Build phase detected: Returning recursive mock Prisma client');
        const createMock = (): any => {
            const mock: any = () => Promise.resolve([]);
            return new Proxy(mock, {
                get: (target, prop) => {
                    if (prop === 'then' || prop === 'toJSON') return undefined;
                    return createMock();
                }
            });
        };
        return createMock();
    }

    const dbUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || '';
    const isAccelerate = dbUrl.startsWith('prisma://') || dbUrl.startsWith('prisma+postgres://');

    console.log(`Initializing Prisma Client. Accelerate: ${isAccelerate}, Using: ${dbUrl.split('@')[0]}...`);

    try {
        if (isAccelerate) {
            // For Accelerate, we pass the URL to the constructor and extend it.
            return new PrismaClient({
                datasourceUrl: dbUrl,
            }).$extends(withAccelerate());
        }
        return new PrismaClient();
    } catch (error) {
        console.error('Failed to initialize Prisma Client:', error);
        // Fallback to a standard client if accelerate initialization fails
        return new PrismaClient();
    }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production' || isBuild) globalForPrisma.prisma = prisma;
