export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/alumni/[id] - Get single alumni (public)
export async function GET(request: NextRequest, { params }: RouteParams) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ message: 'Static build bypass' });
    }
    try {
        const { id } = await params;
        const alumni = await prisma.alumni.findUnique({
            where: { id },
        });

        if (!alumni) {
            return NextResponse.json({ error: 'Alumni not found' }, { status: 404 });
        }

        return NextResponse.json(alumni);
    } catch (error) {
        console.error('Error fetching alumni:', error);
        return NextResponse.json({ error: 'Failed to fetch alumni' }, { status: 500 });
    }
}

// PUT /api/alumni/[id] - Update alumni (admin-only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
        const {
            name,
            email,
            course,
            graduationYear,
            currentRole,
            company,
            domain,
            location,
            summary,
            linkedin,
            image,
        } = body;

        const alumni = await prisma.alumni.update({
            where: { id },
            data: {
                name,
                email: email || null,
                course,
                graduationYear: parseInt(graduationYear),
                currentRole: currentRole || null,
                company: company || null,
                domain: domain || null,
                location: location || null,
                summary: summary || null,
                linkedin: linkedin || null,
                image: image || null,
            },
        });

        // Log the action
        await prisma.adminLog.create({
            data: {
                action: 'UPDATE_ALUMNI',
                entity: 'Alumni',
                entityId: id,
                details: `Updated alumni: ${alumni.name}`,
                adminId: session.user.id,
            },
        });

        return NextResponse.json(alumni);
    } catch (error) {
        console.error('Error updating alumni:', error);
        return NextResponse.json({ error: 'Failed to update alumni' }, { status: 500 });
    }
}

// DELETE /api/alumni/[id] - Delete alumni (admin-only)
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

        const alumni = await prisma.alumni.findUnique({ where: { id }, select: { name: true } });

        // Delete related connection requests first
        await prisma.connectionRequest.deleteMany({
            where: { alumniId: id },
        });

        await prisma.alumni.delete({
            where: { id },
        });

        // Log the action
        await prisma.adminLog.create({
            data: {
                action: 'DELETE_ALUMNI',
                entity: 'Alumni',
                entityId: id,
                details: `Deleted alumni: ${alumni?.name || 'unknown'}`,
                adminId: session.user.id,
            },
        });

        return NextResponse.json({ message: 'Alumni deleted successfully' });
    } catch (error) {
        console.error('Error deleting alumni:', error);
        return NextResponse.json({ error: 'Failed to delete alumni' }, { status: 500 });
    }
}
