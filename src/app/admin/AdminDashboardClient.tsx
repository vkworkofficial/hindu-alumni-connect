"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Clock, CheckCircle2 } from "lucide-react";

interface AdminDashboardClientProps {
    stats: {
        totalAlumni: number;
        totalRequests: number;
        pendingRequests: number;
        approvedRequests: number;
    };
    recentRequests: Array<{
        id: string;
        studentName: string;
        studentEmail: string;
        status: string;
        createdAt: string;
        subject: string;
        category: string;
        alumni: {
            name: string;
            company: string | null;
        };
    }>;
}

export default function AdminDashboardClient({
    stats,
    recentRequests,
}: AdminDashboardClientProps) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Overview of alumni directory and connection requests.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAlumni}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Requests
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRequests}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.approvedRequests}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentRequests.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No requests found.
                            </p>
                        ) : (
                            <div className="space-y-8">
                                {recentRequests.map((req) => (
                                    <div key={req.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {req.studentName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {req.studentEmail} • {req.subject}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                To: {req.alumni.name}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                        req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                            'bg-blue-100 text-blue-800'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
