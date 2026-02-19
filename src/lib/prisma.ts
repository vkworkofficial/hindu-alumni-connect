import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

console.log('PRISMA_DEBUG: Library module loaded');

const globalForPrisma = global as unknown as { prisma: any };

const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

// Log environment status (safely)
const dbUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
const isAccelerate = dbUrl?.startsWith('prisma://') || dbUrl?.startsWith('prisma+postgres://');

console.log('PRISMA_DEBUG: Environment Check:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- NEXT_PHASE: ${process.env.NEXT_PHASE}`);
console.log(`- isBuild: ${isBuild}`);
console.log(`- Database URL present: ${!!dbUrl}`);
console.log(`- Is Accelerate URL: ${!!isAccelerate}`);

function createPrismaClient() {
    if (isBuild) {
        console.log('PRISMA_DEBUG: Returning mock client for build phase');
        return new Proxy({}, { get: () => () => Promise.resolve([]) }) as any;
    }

    if (!dbUrl) {
        console.error('PRISMA_DEBUG: CRITICAL - No database URL found in environment variables!');
        // Fallback to default, which will likely fail but at least we logged it
        return new PrismaClient();
    }

    try {
        if (isAccelerate) {
            console.log('PRISMA_DEBUG: Initializing with Accelerate extension');
            // Correct way for Accelerate: pass empty or default client, then extend
            // We use the datasources config to force the URL from env var if needed
            const client = new PrismaClient({
                datasources: {
                    db: {
                        url: dbUrl,
                    },
                },
            });
            return client.$extends(withAccelerate());
        } else {
            console.log('PRISMA_DEBUG: Initializing standard Prisma Client');
            return new PrismaClient({
                datasources: {
                    db: {
                        url: dbUrl,
                    },
                },
            });
        }
    } catch (error) {
        console.error('PRISMA_DEBUG: Error constructing Prisma Client:', error);
        // Fallback
        return new PrismaClient();
    }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production' || isBuild) globalForPrisma.prisma = prisma;
