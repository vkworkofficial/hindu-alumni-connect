import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
    const directUrl = process.env.DIRECT_DATABASE_URL;

    if (directUrl) {
        // Use pg adapter for direct TCP connection (bypasses prisma dev HTTP proxy)
        const pool = new pg.Pool({ connectionString: directUrl });
        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
    }

    // Fallback: use accelerateUrl for production (Prisma Postgres / Accelerate)
    return new PrismaClient({
        accelerateUrl: process.env.DATABASE_URL!,
    });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
