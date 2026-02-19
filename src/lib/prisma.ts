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
            // For Accelerate, we pass the URL via the datasources property.
            // Bypassing type checking as any because 7.4.0 types seem to have conflicts
            // with these properties in some configurations, even if they are supported at runtime.
            return new PrismaClient({
                datasources: {
                    db: {
                        url: dbUrl,
                    },
                },
            } as any).$extends(withAccelerate());
        }
        return new PrismaClient();
    } catch (error) {
        console.error('Failed to initialize Prisma Client:', error);
        return new PrismaClient();
    }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production' || isBuild) globalForPrisma.prisma = prisma;
