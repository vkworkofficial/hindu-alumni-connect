"use client";

import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    MapPin,
    Briefcase,
    GraduationCap,
    Calendar,
    Linkedin,
    Building,
    User,
    Send,
} from "lucide-react";

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
    image?: string | null;
}

export default function AlumniProfileClient({ alumni }: { alumni: Alumni }) {
    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    return (
        <div className="flex-1 bg-slate-50 py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                <Link
                    href="/alumni"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Directory
                </Link>

                {/* Header Card */}
                <Card className="mb-8 border-none shadow-md overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    <div className="px-6 pb-6 relative">
                        <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-4 gap-4">
                            <Avatar className="h-32 w-32 border-4 border-white shadow-sm">
                                <AvatarImage src={alumni.image || undefined} alt={alumni.name} />
                                <AvatarFallback className="text-2xl bg-slate-100">
                                    {getInitials(alumni.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 pt-2 md:pt-0">
                                <h1 className="text-3xl font-bold text-gray-900">{alumni.name}</h1>
                                <p className="text-lg text-muted-foreground">
                                    {alumni.currentRole && `${alumni.currentRole}`}
                                    {alumni.company && ` at ${alumni.company}`}
                                </p>
                            </div>
                            <div className="flex gap-2 mt-4 md:mt-0">
                                {alumni.linkedin && (
                                    <Button variant="outline" size="icon" asChild>
                                        <a
                                            href={alumni.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                    </Button>
                                )}
                                <Button asChild>
                                    <Link href={`/alumni/${alumni.id}/connect`}>
                                        <Send className="mr-2 h-4 w-4" />
                                        Connect
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Left Column: Details */}
                    <div className="md:col-span-2 space-y-6">
                        {alumni.summary && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>About</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {alumni.summary}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Education & Career</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6 sm:grid-cols-2">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <GraduationCap className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Course</p>
                                        <p className="font-medium">{alumni.course}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg">
                                        <Calendar className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Class of</p>
                                        <p className="font-medium">{alumni.graduationYear}</p>
                                    </div>
                                </div>

                                {alumni.currentRole && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Briefcase className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Current Role</p>
                                            <p className="font-medium">{alumni.currentRole}</p>
                                        </div>
                                    </div>
                                )}

                                {alumni.company && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Building className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Company</p>
                                            <p className="font-medium">{alumni.company}</p>
                                        </div>
                                    </div>
                                )}

                                {alumni.location && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <MapPin className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Location</p>
                                            <p className="font-medium">{alumni.location}</p>
                                        </div>
                                    </div>
                                )}

                                {alumni.domain && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <User className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Industry</p>
                                            <p className="font-medium">{alumni.domain}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Send className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Want to Connect?</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Reach out to {alumni.name.split(' ')[0]} for mentorship, career guidance, or networking.
                                    </p>
                                </div>
                                <Button className="w-full" asChild>
                                    <Link href={`/alumni/${alumni.id}/connect`}>
                                        Send Request
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {alumni.domain && <Badge variant="secondary">{alumni.domain}</Badge>}
                                    <Badge variant="outline">Class of {alumni.graduationYear}</Badge>
                                    {alumni.course && <Badge variant="outline">{alumni.course}</Badge>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
