import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/requests - List all requests (admin-only)
export async function GET() {
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

// POST /api/requests - Create connection request (public)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { studentName, studentEmail, subject, message, category, alumniId } = body;

        if (!studentName || !studentEmail || !subject || !message || !category || !alumniId) {
            return NextResponse.json(
                { error: 'All fields are required' },
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

        const connectionRequest = await prisma.connectionRequest.create({
            data: {
                studentName,
                studentEmail,
                subject,
                message,
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
