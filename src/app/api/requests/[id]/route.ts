import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PATCH /api/requests/[id] - Update request status (admin-only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
            data: { status },
            include: {
                alumni: {
                    select: { id: true, name: true },
                },
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
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await prisma.connectionRequest.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting request:', error);
        return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
    }
}
