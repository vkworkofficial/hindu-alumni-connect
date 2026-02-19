import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// DELETE /api/admin/users/[id] - Delete a user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ message: 'Static build bypass' });
    }
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Prevent self-deletion
        if (id === session.user.id) {
            return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id }, select: { name: true, email: true } });

        await prisma.user.delete({ where: { id } });

        // Log the action
        await prisma.adminLog.create({
            data: {
                action: 'DELETE_USER',
                entity: 'User',
                entityId: id,
                details: `Deleted user: ${user?.name} (${user?.email})`,
                adminId: session.user.id,
            },
        });

        return NextResponse.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
