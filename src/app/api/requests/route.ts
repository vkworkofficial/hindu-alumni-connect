import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const MIN_MESSAGE_CHARS = 100;

// GET /api/requests - List all requests (admin-only)
export async function GET() {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ message: 'Static build bypass' });
    }
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const requests = await prisma.connectionRequest.findMany({
            include: {
                alumni: {
                    select: { id: true, name: true, company: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
    }
}

// POST /api/requests - Create connection request
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { studentName, studentEmail, subject, message, category, alumniId, attachment } = body;

        if (!studentName || !studentEmail || !subject || !message || !category || !alumniId) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Server-side message length validation
        if (message.length < MIN_MESSAGE_CHARS) {
            return NextResponse.json(
                { error: `Message must be at least ${MIN_MESSAGE_CHARS} characters. Currently: ${message.length}.` },
                { status: 400 }
            );
        }

        // Verify alumni exists
        const alumni = await prisma.alumni.findUnique({
            where: { id: alumniId },
        });

        if (!alumni) {
            return NextResponse.json({ error: 'Alumni not found' }, { status: 404 });
        }

        // Build the message — if an attachment was provided, append its metadata
        let fullMessage = message;
        if (attachment && attachment.name) {
            fullMessage += `\n\n---\n📎 Attachment: ${attachment.name} (${(attachment.size / 1024).toFixed(1)} KB)`;
        }

        const connectionRequest = await prisma.connectionRequest.create({
            data: {
                studentName,
                studentEmail,
                subject,
                message: fullMessage,
                category,
                alumniId,
            },
        });

        return NextResponse.json(connectionRequest, { status: 201 });
    } catch (error) {
        console.error('Error creating request:', error);
        return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
    }
}
