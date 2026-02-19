import { prisma } from '@/lib/prisma';
import AlumniDirectoryClient from './AlumniDirectoryClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

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

    // Build where clause
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

    // Get unique filter values
    const allAlumni = await prisma.alumni.findMany({
        select: { course: true, domain: true, graduationYear: true },
    });

    const courses = [...new Set(allAlumni.map((a) => a.course).filter(Boolean))];
    const domains = [...new Set(allAlumni.map((a) => a.domain).filter(Boolean))];
    const years = [...new Set(allAlumni.map((a) => a.graduationYear))].sort((a, b) => b - a);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <AlumniDirectoryClient
                alumni={JSON.parse(JSON.stringify(alumni))}
                courses={courses as string[]}
                domains={domains as string[]}
                years={years as number[]}
                initialSearch={search}
                initialCourse={course}
                initialDomain={domain}
                initialYear={year}
            />
            <Footer />
        </div>
    );
}
