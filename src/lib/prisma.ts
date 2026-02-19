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

    const dbUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
    const isAccelerate = dbUrl?.startsWith('prisma://') || dbUrl?.startsWith('prisma+postgres://');

    console.log(`Prisma: Initializing client. URL present: ${!!dbUrl}, Accelerate: ${!!isAccelerate}`);

    try {
        // Construct options explicitly to avoid "empty options" errors in production
        const options: any = {};
        if (dbUrl) {
            options.datasourceUrl = dbUrl;
        }

        if (isAccelerate && dbUrl) {
            return new PrismaClient(options).$extends(withAccelerate());
        }

        // Even for non-accelerate, passing the URL explicitly can be more robust in some CI/CD environments
        return new PrismaClient(options);
    } catch (error) {
        console.error('Prisma: Critical initialization error:', error);
        // Last resort fallback
        return new PrismaClient();
    }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production' || isBuild) globalForPrisma.prisma = prisma;
