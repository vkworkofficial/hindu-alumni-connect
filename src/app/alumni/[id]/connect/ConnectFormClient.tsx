"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, ArrowLeft, Send } from "lucide-react";

interface Alumni {
    id: string;
    name: string;
    currentRole?: string;
    company?: string;
}

const categories = [
    { value: "MENTORSHIP", label: "Mentorship" },
    { value: "CAREER_GUIDANCE", label: "Career Guidance" },
    { value: "INTERNSHIP", label: "Internship Opportunity" },
    { value: "NETWORKING", label: "Networking" },
    { value: "OTHER", label: "Other" },
];

export default function ConnectFormClient({ alumni }: { alumni: Alumni }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        studentName: "",
        studentEmail: "",
        subject: "",
        message: "",
        category: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange =
        (field: string) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setFormData((prev) => ({ ...prev, [field]: e.target.value }));
            };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, category: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    alumniId: alumni.id,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to send request");
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    if (success) {
        return (
            <div className="flex-1 flex items-center justify-center p-4 bg-slate-50 min-h-[60vh]">
                <Card className="w-full max-w-md text-center">
                    <CardHeader className="flex flex-col items-center gap-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                        <CardTitle className="text-2xl">Request Sent!</CardTitle>
                        <CardDescription>
                            Your connection request to {alumni.name} has been submitted successfully. You'll hear back once it's reviewed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/alumni/${alumni.id}`}>Back to Profile</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/alumni">Browse More Alumni</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-slate-50 py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Link
                    href={`/alumni/${alumni.id}`}
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Profile
                </Link>
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Sidebar: Alumni Info */}
                    <div className="md:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader className="text-center">
                                <Avatar className="h-16 w-16 mx-auto mb-2">
                                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                                        {getInitials(alumni.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle>{alumni.name}</CardTitle>
                                <CardDescription>
                                    {alumni.currentRole}
                                    {alumni.company && ` at ${alumni.company}`}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Main Form */}
                    <div className="md:col-span-2">
                        <h1 className="text-3xl font-bold mb-2">
                            Send a <span className="text-primary">Connection Request</span>
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            Fill out the form below to reach out to {alumni.name.split(" ")[0]}. Be specific about what you're looking for.
                        </p>

                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Card>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="studentName">Your Full Name</Label>
                                            <Input
                                                id="studentName"
                                                value={formData.studentName}
                                                onChange={handleChange("studentName")}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="studentEmail">Your Email</Label>
                                            <Input
                                                id="studentEmail"
                                                type="email"
                                                value={formData.studentEmail}
                                                onChange={handleChange("studentEmail")}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={handleSelectChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input
                                            id="subject"
                                            value={formData.subject}
                                            onChange={handleChange("subject")}
                                            placeholder="e.g., Seeking mentorship in software engineering"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={handleChange("message")}
                                            placeholder="Tell them about yourself, what you're looking for, and how they can help..."
                                            className="min-h-[120px]"
                                            required
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Send Request
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
