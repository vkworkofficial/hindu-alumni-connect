"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, ArrowLeft, Send, ShieldCheck, Mail } from "lucide-react";

interface Alumni {
    id: string;
    name: string;
    currentRole?: string;
    company?: string;
    image?: string | null;
}

const categories = [
    { value: "MENTORSHIP", label: "Mentorship Inquiry" },
    { value: "CAREER_GUIDANCE", label: "Career Guidance" },
    { value: "INTERNSHIP", label: "Internship Opportunity" },
    { value: "NETWORKING", label: "Professional Networking" },
    { value: "OTHER", label: "Other Inquiry" },
];

export default function ConnectFormClient({ alumni }: { alumni: Alumni }) {
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

    const handleChange = (field: string) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
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
                throw new Error(data.error || "Failed to send the request. Please try again.");
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please check your connection.");
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
            <div className="flex-1 flex items-center justify-center p-4 min-h-[70vh] bg-slate-50/50">
                <Card className="w-full max-w-lg text-center shadow-2xl border-none p-6 rounded-2xl">
                    <CardHeader className="flex flex-col items-center gap-6">
                        <div className="p-4 bg-green-50 rounded-full">
                            <CheckCircle2 className="h-20 w-20 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-black">Request Sent!</CardTitle>
                            <CardDescription className="text-lg">
                                Your inquiry has been delivered to <strong>{alumni.name}</strong>. They will be notified of your interest.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                        <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                            <Link href={`/alumni/${alumni.id}`}>View Profile</Link>
                        </Button>
                        <Button size="lg" className="rounded-full px-8" asChild>
                            <Link href="/alumni">Browse Directory</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="bg-slate-50/50 min-h-full py-8 md:py-16">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                {/* Back Button */}
                <Link
                    href={`/alumni/${alumni.id}`}
                    className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-8 group transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to {alumni.name.split(' ')[0]}'s Profile
                </Link>

                <div className="grid gap-10 lg:grid-cols-3">
                    {/* Header/Info Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black tracking-tight leading-none text-foreground">
                                Send a <span className="text-primary">Connection</span> Request
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Introduce yourself and explain how {alumni.name.split(' ')[0]} can help you. A clear, concise message increases your chances of a response.
                            </p>
                        </div>

                        <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden bg-background">
                            <div className="h-24 bg-slate-100 flex items-center justify-center">
                                <Avatar className="h-20 w-20 border-4 border-background shadow-md">
                                    <AvatarImage src={alumni.image || undefined} alt={alumni.name} />
                                    <AvatarFallback className="text-xl font-bold bg-white text-slate-900">
                                        {getInitials(alumni.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <CardContent className="pt-8 text-center pb-6">
                                <h3 className="font-bold text-lg">{alumni.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {alumni.currentRole}
                                    {alumni.company && ` at ${alumni.company}`}
                                </p>
                            </CardContent>
                        </Card>

                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-3">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                <ShieldCheck className="h-4 w-4" />
                                Professional Conduct
                            </div>
                            <p className="text-xs text-muted-foreground leading-normal">
                                Ensure your message is professional and purposeful. Avoid spamming or overly general requests.
                            </p>
                        </div>
                    </div>

                    {/* Main Form Area */}
                    <div className="lg:col-span-2">
                        {error && (
                            <Alert variant="destructive" className="mb-8 border-none shadow-md">
                                <AlertTitle className="font-bold uppercase tracking-wider text-xs">Error Occurred</AlertTitle>
                                <AlertDescription className="font-medium">{error}</AlertDescription>
                            </Alert>
                        )}

                        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
                            <CardContent className="p-8 md:p-10">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="studentName" className="font-bold text-foreground">Your Full Name</Label>
                                            <Input
                                                id="studentName"
                                                placeholder="Enter your name"
                                                value={formData.studentName}
                                                onChange={handleChange("studentName")}
                                                required
                                                className="bg-slate-50 border-slate-200 h-11 focus:bg-white transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="studentEmail" className="font-bold text-foreground">Your Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="studentEmail"
                                                    type="email"
                                                    placeholder="email@example.com"
                                                    value={formData.studentEmail}
                                                    onChange={handleChange("studentEmail")}
                                                    required
                                                    className="bg-slate-50 border-slate-200 h-11 pl-10 focus:bg-white transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="font-bold text-foreground">Subject Category</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={handleSelectChange}
                                            required
                                        >
                                            <SelectTrigger className="bg-slate-50 border-slate-200 h-11 focus:bg-white transition-colors">
                                                <SelectValue placeholder="Select why you're reaching out" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl p-1">
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.value} value={cat.value} className="rounded-lg">
                                                        {cat.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="font-bold text-foreground">Brief Subject</Label>
                                        <Input
                                            id="subject"
                                            placeholder="e.g. Seeking advice on entering Fintech"
                                            value={formData.subject}
                                            onChange={handleChange("subject")}
                                            required
                                            className="bg-slate-50 border-slate-200 h-11 focus:bg-white transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="font-bold text-foreground">Your Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Write your detailed request here..."
                                            value={formData.message}
                                            onChange={handleChange("message")}
                                            className="min-h-[160px] bg-slate-50 border-slate-200 focus:bg-white transition-colors p-4 leading-relaxed"
                                            required
                                        />
                                    </div>

                                    <Button type="submit" className="w-full h-12 text-lg font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-5 w-5" />
                                                Submit Request
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
