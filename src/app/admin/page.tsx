import { prisma } from '@/lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Admin Dashboard | Hindu Connect',
};

export default async function AdminDashboardPage() {
    const [totalAlumni, totalRequests, pendingRequests, recentRequests] =
        await Promise.all([
            prisma.alumni.count(),
            prisma.connectionRequest.count(),
            prisma.connectionRequest.count({ where: { status: 'PENDING' } }),
            prisma.connectionRequest.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    alumni: { select: { name: true, company: true } },
                },
            }),
        ]);

    const approvedRequests = await prisma.connectionRequest.count({
        where: { status: 'APPROVED' },
    });

    return (
        <AdminDashboardClient
            stats={{
                totalAlumni,
                totalRequests,
                pendingRequests,
                approvedRequests,
            }}
            recentRequests={JSON.parse(JSON.stringify(recentRequests))}
        />
    );
}
