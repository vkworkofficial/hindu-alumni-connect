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
    ExternalLink,
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
        <div className="bg-slate-50/50 min-h-full py-8 md:py-16">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                {/* Navigation */}
                <Link
                    href="/alumni"
                    className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-8 group transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Alumni Directory
                </Link>

                {/* Hero Profile Section */}
                <div className="relative mb-10">
                    <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden rounded-2xl">
                        {/* Banner Decoration */}
                        <div className="h-40 bg-gradient-to-r from-primary/90 via-blue-600 to-indigo-700"></div>

                        <div className="px-6 md:px-10 pb-8 relative">
                            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 mb-6 gap-6 text-center md:text-left">
                                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl rounded-full">
                                    <AvatarImage src={alumni.image || undefined} alt={alumni.name} />
                                    <AvatarFallback className="text-3xl font-bold bg-slate-100 text-slate-900">
                                        {getInitials(alumni.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-2 md:pb-2">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                                            {alumni.name}
                                        </h1>
                                        {alumni.domain && (
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-3 font-semibold">
                                                {alumni.domain}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-lg md:text-xl font-medium text-muted-foreground">
                                        {alumni.currentRole || "Alumni"}
                                        {alumni.company && (
                                            <span>
                                                <span className="mx-2 opacity-50">•</span>
                                                {alumni.company}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-3 md:pb-2">
                                    {alumni.linkedin && (
                                        <Button variant="outline" size="lg" className="rounded-full px-6" asChild>
                                            <a
                                                href={alumni.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Linkedin className="mr-2 h-4 w-4" />
                                                LinkedIn
                                            </a>
                                        </Button>
                                    )}
                                    <Button size="lg" className="rounded-full px-8 shadow-md hover:shadow-lg transition-all" asChild>
                                        <Link href={`/alumni/${alumni.id}/connect`}>
                                            <Send className="mr-2 h-4 w-4" />
                                            Connect
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left/Main Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <section>
                            <Card className="border-border/50 shadow-sm rounded-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        About
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {alumni.summary ? (
                                        <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-wrap">
                                            {alumni.summary}
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground italic italic">
                                            No bio provided.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </section>

                        {/* Experience & Details */}
                        <section>
                            <Card className="border-border/50 shadow-sm rounded-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                        Education & Professional Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-8 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Course
                                        </p>
                                        <div className="flex items-center gap-2 font-semibold text-lg">
                                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                                            {alumni.course}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Graduation Year
                                        </p>
                                        <div className="flex items-center gap-2 font-semibold text-lg">
                                            <Calendar className="h-5 w-5 text-muted-foreground" />
                                            Class of {alumni.graduationYear}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Current Organization
                                        </p>
                                        <div className="flex items-center gap-2 font-semibold text-lg">
                                            <Building className="h-5 w-5 text-muted-foreground" />
                                            {alumni.company || "N/A"}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Location
                                        </p>
                                        <div className="flex items-center gap-2 font-semibold text-lg">
                                            <MapPin className="h-5 w-5 text-muted-foreground" />
                                            {alumni.location || "N/A"}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    </div>

                    {/* Right/Sidebar Column */}
                    <div className="space-y-8">
                        {/* Quick Connection Card */}
                        <Card className="bg-primary border-none text-primary-foreground shadow-lg rounded-xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Send className="h-24 w-24 -mr-8 -mt-8" />
                            </div>
                            <CardContent className="pt-8 relative z-10 text-center space-y-4">
                                <h3 className="text-xl font-bold">Interested in connecting?</h3>
                                <p className="text-primary-foreground/80 text-sm">
                                    Reach out to {alumni.name.split(' ')[0]} for mentorship, internship opportunities, or professional networking.
                                </p>
                                <Button size="lg" variant="secondary" className="w-full font-bold shadow-md hover:bg-white transition-colors" asChild>
                                    <Link href={`/alumni/${alumni.id}/connect`}>
                                        Send Connection Request
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Details Sidebar */}
                        <Card className="border-border/50 shadow-sm rounded-xl">
                            <CardHeader>
                                <CardTitle className="text-base font-bold">Profile Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
                                        Industry
                                    </p>
                                    <Badge variant="outline" className="text-foreground/80 font-medium px-2.5 py-1">
                                        {alumni.domain || "Not specified"}
                                    </Badge>
                                </div>

                                <Separator className="opacity-50" />

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
                                        Social
                                    </p>
                                    {alumni.linkedin ? (
                                        <a
                                            href={alumni.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between group p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-border/50 transition-all text-sm font-medium"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Linkedin className="h-4 w-4 text-blue-600" />
                                                LinkedIn Profile
                                            </span>
                                            <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic px-1">No links available.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
