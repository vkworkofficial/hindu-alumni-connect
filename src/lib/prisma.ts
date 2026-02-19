import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
    const directUrl = process.env.DIRECT_DATABASE_URL;
    const dbUrl = process.env.DATABASE_URL;

    if (directUrl) {
        try {
            const pool = new pg.Pool({ connectionString: directUrl });
            const adapter = new PrismaPg(pool);
            return new PrismaClient({ adapter });
        } catch (e) {
            console.error('Failed to initialize Prisma with adapter:', e);
        }
    }

    // Default to DATABASE_URL if provided, otherwise empty config for build safety
    const config: any = {};
    if (dbUrl) {
        if (dbUrl.includes('prisma://') || dbUrl.includes('prisma+postgres://')) {
            config.accelerateUrl = dbUrl;
        } else {
            config.datasources = { db: { url: dbUrl } };
        }
    }

    return new PrismaClient(config);
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
