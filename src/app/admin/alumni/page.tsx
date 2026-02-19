"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Plus, Search, MapPin, Briefcase, Linkedin } from "lucide-react";
import { COURSES } from "@/lib/constants";

interface Alumni {
    id: string;
    name: string;
    email?: string;
    course: string;
    graduationYear: number;
    currentRole?: string;
    company?: string;
    domain?: string;
    location?: string;
    summary?: string;
    linkedin?: string;
    imageUrl?: string;
}

const emptyForm = {
    name: "",
    email: "",
    course: "",
    graduationYear: "",
    currentRole: "",
    company: "",
    domain: "",
    location: "",
    summary: "",
    linkedin: "",
    imageUrl: "",
};

export default function AdminAlumniPage() {
    const [alumni, setAlumni] = useState<Alumni[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const fetchAlumni = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            const res = await fetch(`/api/alumni?${params.toString()}`);
            const data = await res.json();
            setAlumni(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchAlumni();
    }, [fetchAlumni]);

    const handleOpen = (a?: Alumni) => {
        if (a) {
            setEditingId(a.id);
            setFormData({
                name: a.name,
                email: a.email || "",
                course: a.course,
                graduationYear: a.graduationYear.toString(),
                currentRole: a.currentRole || "",
                company: a.company || "",
                domain: a.domain || "",
                location: a.location || "",
                summary: a.summary || "",
                linkedin: a.linkedin || "",
                imageUrl: a.imageUrl || "",
            });
        } else {
            setEditingId(null);
            setFormData(emptyForm);
        }
        setDialogOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = editingId ? `/api/alumni/${editingId}` : "/api/alumni";
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Failed");
            setDialogOpen(false);
            fetchAlumni();
        } catch (e) {
            alert("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/alumni/${id}`, { method: "DELETE" });
            fetchAlumni();
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6 text-foreground">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Alumni Management</h2>
                <Button onClick={() => handleOpen()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Alumni
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {alumni.map((person) => (
                    <Card key={person.id}>
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={person.imageUrl} alt={person.name} />
                                <AvatarFallback>{person.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <CardTitle className="text-base font-semibold leading-none">
                                    {person.name}
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    {person.currentRole && (
                                        <div className="flex items-center gap-1">
                                            <Briefcase className="h-3 w-3" />
                                            {person.currentRole} {person.company && `at ${person.company}`}
                                        </div>
                                    )}
                                    {person.location && (
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <MapPin className="h-3 w-3" />
                                            {person.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                    {person.course}
                                </span>
                                <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                    Class of {person.graduationYear}
                                </span>
                            </div>
                            <div className="flex justify-end gap-2">
                                {person.linkedin && (
                                    <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary">
                                        <Linkedin className="h-4 w-4" />
                                    </a>
                                )}
                                <Button variant="ghost" size="icon" onClick={() => handleOpen(person)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(person.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Alumni" : "Add Alumni"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Course</Label>
                                <Select value={formData.course} onValueChange={v => setFormData({ ...formData, course: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COURSES.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Graduation Year</Label>
                                <Input type="number" value={formData.graduationYear} onChange={e => setFormData({ ...formData, graduationYear: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Current Role</Label>
                                <Input value={formData.currentRole} onChange={e => setFormData({ ...formData, currentRole: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Company</Label>
                                <Input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Domain</Label>
                                <Input value={formData.domain} onChange={e => setFormData({ ...formData, domain: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Photo URL</Label>
                            <Input value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label>LinkedIn URL</Label>
                            <Input value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Summary</Label>
                            <Textarea value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
