import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

// GET /api/admin/logs - List admin action logs
export async function GET() {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json([]);
    }
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const logs = await prisma.adminLog.findMany({
            include: {
                admin: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}
