export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import AlumniDirectoryClient from './AlumniDirectoryClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Alumni Directory | Hindu Connect',
    description: 'Browse and connect with accomplished alumni from various industries.',
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function AlumniPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const search = params.search || '';
    const course = params.course || '';
    const domain = params.domain || '';
    const year = params.year || '';

    // Build the query object for Prisma
    const where: any = {};

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { company: { contains: search, mode: 'insensitive' } },
            { currentRole: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (course && course !== 'all') {
        where.course = { equals: course, mode: 'insensitive' };
    }

    if (domain && domain !== 'all') {
        where.domain = { equals: domain, mode: 'insensitive' };
    }

    if (year && year !== 'all') {
        const parsedYear = parseInt(year);
        if (!isNaN(parsedYear)) {
            where.graduationYear = parsedYear;
        }
    }

    // Fetch filtered alumni list
    const alumni = await prisma.alumni.findMany({
        where,
        orderBy: { name: 'asc' },
    });

    // Fetch metadata for filter dropdowns (to ensure they are always populated correctly)
    const allAlumni = await prisma.alumni.findMany({
        select: { course: true, domain: true, graduationYear: true },
    });

    const courses = [...new Set(allAlumni.map((a: { course: string }) => a.course).filter(Boolean))].sort();
    const domains = [...new Set(allAlumni.map((a: { domain: string | null }) => a.domain).filter(Boolean))].sort();
    const years = (([...new Set(allAlumni.map((a: { graduationYear: number }) => a.graduationYear))] as number[])).sort((a, b) => b - a);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <AlumniDirectoryClient
                alumni={JSON.parse(JSON.stringify(alumni))}
                courses={courses as string[]}
                domains={domains as string[]}
                years={years as number[]}
                initialFilters={{
                    search,
                    course,
                    domain,
                    year,
                }}
            />
            <Footer />
        </div>
    );
}
