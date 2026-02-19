"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, ScrollText, User, Clock } from "lucide-react";

interface LogEntry {
    id: string;
    action: string;
    entity: string;
    entityId: string | null;
    details: string | null;
    createdAt: string;
    admin: {
        id: string;
        name: string | null;
        email: string | null;
    };
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
    APPROVE_REQUEST: { label: "Approved", color: "bg-green-100 text-green-800" },
    REJECT_REQUEST: { label: "Rejected", color: "bg-red-100 text-red-800" },
    RESOLVE_REQUEST: { label: "Resolved", color: "bg-blue-100 text-blue-800" },
    REOPEN_REQUEST: { label: "Reopened", color: "bg-yellow-100 text-yellow-800" },
    DELETE_REQUEST: { label: "Deleted", color: "bg-red-100 text-red-800" },
    CREATE_USER: { label: "User Created", color: "bg-purple-100 text-purple-800" },
    DELETE_USER: { label: "User Deleted", color: "bg-red-100 text-red-800" },
    ADD_COMMENT: { label: "Comment", color: "bg-slate-100 text-slate-800" },
    ADD_ALUMNI: { label: "Alumni Added", color: "bg-green-100 text-green-800" },
    UPDATE_ALUMNI: { label: "Alumni Updated", color: "bg-blue-100 text-blue-800" },
    DELETE_ALUMNI: { label: "Alumni Deleted", color: "bg-red-100 text-red-800" },
};

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    const fetchLogs = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/logs");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));
    const filtered = filter === "ALL" ? logs : logs.filter((l) => l.action === filter);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6 text-foreground">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <ScrollText className="h-8 w-8" />
                        Activity Log
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Track all admin actions across the platform
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Action" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Actions</SelectItem>
                            {uniqueActions.map((action) => (
                                <SelectItem key={action} value={action}>
                                    {ACTION_LABELS[action]?.label || action}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Admin</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Entity</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No log entries found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((log) => {
                                    const actionInfo = ACTION_LABELS[log.action] || { label: log.action, color: "bg-slate-100 text-slate-800" };
                                    return (
                                        <TableRow key={log.id}>
                                            <TableCell className="whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {format(new Date(log.createdAt), "MMM d, yyyy")}
                                                </div>
                                                <div className="text-xs text-muted-foreground ml-5.5">
                                                    {format(new Date(log.createdAt), "h:mm a")}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                        {log.admin.name?.[0] || "A"}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium">{log.admin.name || "Admin"}</div>
                                                        <div className="text-xs text-muted-foreground">{log.admin.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${actionInfo.color} hover:${actionInfo.color}`}>
                                                    {actionInfo.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">
                                                    {log.entity}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {log.details || "—"}
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
