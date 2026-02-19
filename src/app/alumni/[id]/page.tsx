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
    try {
        const { id } = await params;
        const alumni = await prisma.alumni.findUnique({ where: { id } });

        if (!alumni) return { title: 'Alumni Not Found | Hindu Connect' };

        return {
            title: `${alumni.name} | Hindu Connect`,
            description: alumni.summary || `Professional profile of ${alumni.name}, ${alumni.currentRole} at ${alumni.company}.`,
        };
    } catch (e) {
        return { title: 'Alumni Profile | Hindu Connect' };
    }
}

export default async function AlumniProfilePage({ params }: PageProps) {
    const { id } = await params;

    const alumni = await prisma.alumni.findUnique({
        where: { id }
    });

    if (!alumni) notFound();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-1">
                <AlumniProfileClient alumni={JSON.parse(JSON.stringify(alumni))} />
            </main>
            <Footer />
        </div>
    );
}
