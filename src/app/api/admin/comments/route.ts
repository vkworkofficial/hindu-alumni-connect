import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

// GET /api/admin/comments?entity=ConnectionRequest&entityId=xxx
export async function GET(request: NextRequest) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json([]);
    }
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const entity = searchParams.get('entity');
        const entityId = searchParams.get('entityId');

        if (!entity || !entityId) {
            return NextResponse.json({ error: 'entity and entityId are required' }, { status: 400 });
        }

        const comments = await prisma.comment.findMany({
            where: { entity, entityId },
            include: {
                author: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

// POST /api/admin/comments - Add a comment
export async function POST(request: NextRequest) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ message: 'Static build bypass' });
    }
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { content, entity, entityId } = body;

        if (!content || !entity || !entityId) {
            return NextResponse.json({ error: 'content, entity, and entityId are required' }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                entity,
                entityId,
                authorId: session.user.id,
            },
            include: {
                author: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        // Log the action
        await prisma.adminLog.create({
            data: {
                action: 'ADD_COMMENT',
                entity,
                entityId,
                details: `Added comment on ${entity}: "${content.substring(0, 80)}${content.length > 80 ? '...' : ''}"`,
                adminId: session.user.id,
            },
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}
