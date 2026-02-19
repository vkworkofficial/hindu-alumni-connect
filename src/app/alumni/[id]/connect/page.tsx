import { notFound, redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from '@/lib/prisma';
import ConnectFormClient from './ConnectFormClient';
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
        title: `Connect with ${alumni.name} | Hindu Connect`,
        description: `Send a connection request to ${alumni.name}`,
    };
}

export default async function ConnectPage({ params }: PageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect(`/api/auth/signin?callbackUrl=/alumni/${id}/connect`);
    }

    const alumni = await prisma.alumni.findUnique({
        where: { id },
        select: { id: true, name: true, currentRole: true, company: true },
    });

    if (!alumni) notFound();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <ConnectFormClient alumni={JSON.parse(JSON.stringify(alumni))} />
            <Footer />
        </div>
    );
}
