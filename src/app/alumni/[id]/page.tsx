import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AlumniProfileClient from './AlumniProfileClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const alumni = await prisma.alumni.findUnique({ where: { id } });
    if (!alumni) return { title: 'Alumni Not Found' };
    return {
        title: `${alumni.name} | Hindu Connect`,
        description: alumni.summary || `Profile of ${alumni.name}, ${alumni.currentRole} at ${alumni.company}`,
    };
}

export default async function AlumniProfilePage({ params }: PageProps) {
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
