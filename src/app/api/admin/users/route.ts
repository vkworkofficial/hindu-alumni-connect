import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET /api/admin/users - List all users
export async function GET() {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json([]);
    }
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST /api/admin/users - Create a new admin user
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
        const { name, email, password, role } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
        }

        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'ADMIN',
                isProfileComplete: true,
            },
            select: { id: true, name: true, email: true, role: true },
        });

        // Log the action
        await prisma.adminLog.create({
            data: {
                action: 'CREATE_USER',
                entity: 'User',
                entityId: user.id,
                details: `Created ${user.role} user: ${user.name} (${user.email})`,
                adminId: session.user.id,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
