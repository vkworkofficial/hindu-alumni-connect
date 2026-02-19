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

    if (!dbUrl) {
        console.warn('Prisma: No DATABASE_URL found. Falling back to default constructor.');
        return new PrismaClient();
    }

    const isAccelerate = dbUrl.startsWith('prisma://') || dbUrl.startsWith('prisma+postgres://');
    console.log(`Prisma: Initializing client. Accelerate: ${isAccelerate}`);

    try {
        if (isAccelerate) {
            // Using datasourceUrl as it's often more reliable for Accelerate in recent Prisma versions
            return new PrismaClient({
                datasourceUrl: dbUrl,
            } as any).$extends(withAccelerate());
        }

        // For non-accelerate, we let Prisma pick up DATABASE_URL from the environment or pass it explicitly
        return new PrismaClient({
            datasources: {
                db: {
                    url: dbUrl,
                },
            },
        } as any);
    } catch (error) {
        console.error('Prisma: Critical initialization error:', error);
        return new PrismaClient();
    }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production' || isBuild) globalForPrisma.prisma = prisma;
