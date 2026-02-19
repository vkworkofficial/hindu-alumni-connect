"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Check, X, Trash2, Filter } from "lucide-react";

interface Request {
    id: string;
    studentName: string;
    studentEmail: string;
    subject: string;
    message: string;
    category: string;
    status: string;
    alumniId: string;
    createdAt: string;
    alumni: {
        id: string;
        name: string;
        company?: string;
    };
}

export default function AdminRequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [viewRequest, setViewRequest] = useState<Request | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        try {
            const res = await fetch("/api/requests");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error("Failed to update");
            fetchRequests();
            if (viewRequest?.id === id) {
                setViewRequest((prev) => (prev ? { ...prev, status } : null));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/requests/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            setDeleteConfirm(null);
            setViewRequest(null);
            fetchRequests();
        } catch (err) {
            console.error(err);
        }
    };

    const filtered =
        filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6 text-foreground">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Requests</h2>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Requests</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Alumni (Target)</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No requests found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell>
                                            <div className="font-medium">{req.studentName}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {req.studentEmail}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/alumni/${req.alumni.id}`}
                                                className="text-primary hover:underline font-medium"
                                                target="_blank"
                                            >
                                                {req.alumni.name}
                                            </Link>
                                            <div className="text-xs text-muted-foreground">
                                                {req.alumni.company}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{req.category}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    req.status === "PENDING"
                                                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                                        : req.status === "APPROVED"
                                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                            : req.status === "REJECTED"
                                                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                                                : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                                }
                                            >
                                                {req.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(req.createdAt), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setViewRequest(req)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {req.status === "PENDING" && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => updateStatus(req.id, "APPROVED")}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => updateStatus(req.id, "REJECTED")}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => setDeleteConfirm(req.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* View Dialog */}
            <Dialog open={!!viewRequest} onOpenChange={(o) => !o && setViewRequest(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                    </DialogHeader>
                    {viewRequest && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">From</label>
                                    <p className="font-medium">{viewRequest.studentName}</p>
                                    <p className="text-xs text-muted-foreground">{viewRequest.studentEmail}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">To</label>
                                    <p className="font-medium">
                                        <Link href={`/alumni/${viewRequest.alumniId}`} className="text-primary hover:underline">
                                            {viewRequest.alumni.name}
                                        </Link>
                                    </p>
                                    <p className="text-xs text-muted-foreground">{viewRequest.alumni.company}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                                    <p>{viewRequest.category}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Subject</label>
                                    <p>{viewRequest.subject}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Message</label>
                                <div className="mt-1 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                                    {viewRequest.message}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                {viewRequest.status === "PENDING" ? (
                                    <>
                                        <Button variant="destructive" onClick={() => updateStatus(viewRequest.id, "REJECTED")}>
                                            Reject
                                        </Button>
                                        <Button onClick={() => updateStatus(viewRequest.id, "APPROVED")}>
                                            Approve
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="outline" onClick={() => setViewRequest(null)}>Close</Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={!!deleteConfirm} onOpenChange={(o) => !o && setDeleteConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Request?</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this. This cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
