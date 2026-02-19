import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/alumni - List/search alumni (public)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const course = searchParams.get('course') || '';
        const domain = searchParams.get('domain') || '';
        const year = searchParams.get('year') || '';

        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { company: { contains: search, mode: 'insensitive' } },
                { currentRole: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (course) where.course = { contains: course, mode: 'insensitive' };
        if (domain) where.domain = { contains: domain, mode: 'insensitive' };
        if (year) where.graduationYear = parseInt(year);

        const alumni = await prisma.alumni.findMany({
            where,
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(alumni);
    } catch (error) {
        console.error('Error fetching alumni:', error);
        return NextResponse.json({ error: 'Failed to fetch alumni' }, { status: 500 });
    }
}

// POST /api/alumni - Create alumni (admin-only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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

        if (!name || !course || !graduationYear) {
            return NextResponse.json(
                { error: 'Name, course, and graduation year are required' },
                { status: 400 }
            );
        }

        const alumni = await prisma.alumni.create({
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

        return NextResponse.json(alumni, { status: 201 });
    } catch (error) {
        console.error('Error creating alumni:', error);
        return NextResponse.json({ error: 'Failed to create alumni' }, { status: 500 });
    }
}
