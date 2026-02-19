"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
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
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, UserPlus } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function AdminUsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "ADMIN" });

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            setUsers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreate = async () => {
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });
            if (!res.ok) throw new Error("Failed");
            setIsOpen(false);
            setNewUser({ name: "", email: "", password: "", role: "ADMIN" });
            fetchUsers();
        } catch (e) {
            alert("Failed to create user");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            fetchUsers();
        } catch (e) { console.error(e) }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6 text-foreground">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Admin</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Select value={newUser.role} onValueChange={v => setNewUser({ ...newUser, role: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate}>Create User</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} disabled={user.id === session?.user?.id}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
