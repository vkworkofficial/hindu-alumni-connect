export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AlumniProfileClient from './AlumniProfileClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production') {
        return { title: 'Alumni Profile | Hindu Connect' };
    }
    try {
        const { id } = await params;
        const alumni = await prisma.alumni.findUnique({ where: { id } });
        if (!alumni) return { title: 'Alumni Not Found' };
        return {
            title: `${alumni.name} | Hindu Connect`,
            description: alumni.summary || `Profile of ${alumni.name}, ${alumni.currentRole} at ${alumni.company}`,
        };
    } catch (e) {
        return { title: 'Alumni Profile | Hindu Connect' };
    }
}

export default async function AlumniProfilePage({ params }: PageProps) {
    if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p>Loading Profile...</p>
            </div>
        );
    }
    const { id } = await params;
    const alumni = await prisma.alumni.findUnique({ where: { id } });

    if (!alumni) notFound();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <AlumniProfileClient alumni={JSON.parse(JSON.stringify(alumni))} />
            <Footer />
        </div>
    );
}
