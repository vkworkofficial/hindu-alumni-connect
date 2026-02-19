export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PATCH /api/requests/[id] - Update request status (admin-only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ message: 'Static build bypass' });
    }
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status || !['PENDING', 'APPROVED', 'REJECTED', 'RESOLVED'].includes(status)) {
            return NextResponse.json(
                { error: 'Valid status is required (PENDING, APPROVED, REJECTED, RESOLVED)' },
                { status: 400 }
            );
        }

        const updated = await prisma.connectionRequest.update({
            where: { id },
            data: {
                status,
                reviewedBy: session.user.id,
                reviewedByName: session.user.name || session.user.email || 'Admin',
                reviewedAt: new Date(),
            },
            include: {
                alumni: {
                    select: { id: true, name: true },
                },
            },
        });

        // Create audit log entry
        const actionMap: Record<string, string> = {
            APPROVED: 'APPROVE_REQUEST',
            REJECTED: 'REJECT_REQUEST',
            RESOLVED: 'RESOLVE_REQUEST',
            PENDING: 'REOPEN_REQUEST',
        };

        await prisma.adminLog.create({
            data: {
                action: actionMap[status] || 'UPDATE_REQUEST',
                entity: 'ConnectionRequest',
                entityId: id,
                details: `${status.toLowerCase()} request from ${updated.studentName} to ${updated.alumni.name}`,
                adminId: session.user.id,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating request:', error);
        return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
    }
}

// DELETE /api/requests/[id] - Delete request (admin-only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ message: 'Static build bypass' });
    }
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const req = await prisma.connectionRequest.findUnique({
            where: { id },
            select: { studentName: true },
        });

        await prisma.connectionRequest.delete({
            where: { id },
        });

        // Log the deletion
        await prisma.adminLog.create({
            data: {
                action: 'DELETE_REQUEST',
                entity: 'ConnectionRequest',
                entityId: id,
                details: `Deleted request from ${req?.studentName || 'unknown'}`,
                adminId: session.user.id,
            },
        });

        return NextResponse.json({ message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting request:', error);
        return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
    }
}
