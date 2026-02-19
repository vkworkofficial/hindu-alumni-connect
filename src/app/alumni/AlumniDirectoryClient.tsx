"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Briefcase, GraduationCap, X } from "lucide-react";

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

interface Props {
    alumni: Alumni[];
    courses: string[];
    domains: string[];
    years: number[];
    initialSearch: string;
    initialCourse: string;
    initialDomain: string;
    initialYear: string;
}

export default function AlumniDirectoryClient({
    alumni,
    courses,
    domains,
    years,
    initialSearch,
    initialCourse,
    initialDomain,
    initialYear,
}: Props) {
    const router = useRouter();
    const [search, setSearch] = useState(initialSearch);
    const [course, setCourse] = useState(initialCourse);
    const [domain, setDomain] = useState(initialDomain);
    const [year, setYear] = useState(initialYear);

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (course) params.set("course", course);
        if (domain) params.set("domain", domain);
        if (year) params.set("year", year);
        router.push(`/alumni?${params.toString()}`);
    };

    const clearFilters = () => {
        setSearch("");
        setCourse("");
        setDomain("");
        setYear("");
        router.push("/alumni");
    };

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    const hasActiveFilters = search || course || domain || year;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header Section */}
            <div className="border-b bg-card pt-16 pb-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid gap-8 md:grid-cols-2 lg:items-center">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                                Alumni Directory
                            </h1>
                            <p className="max-w-[600px] text-muted-foreground text-lg">
                                Connect with accomplished alumni across various industries and
                                domains to expand your professional network.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, company, or role..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                                    className="pl-9 h-10"
                                />
                            </div>
                            <Button onClick={applyFilters}>Search</Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mt-8 flex flex-wrap gap-4 items-center">
                        <Select value={course} onValueChange={setCourse}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Courses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Courses</SelectItem>
                                {courses.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={domain} onValueChange={setDomain}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Domains" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Domains</SelectItem>
                                {domains.map((d) => (
                                    <SelectItem key={d} value={d}>
                                        {d}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="All Years" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Years</SelectItem>
                                {years.map((y) => (
                                    <SelectItem key={y} value={y.toString()}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="text-muted-foreground"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 bg-slate-50 py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mb-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Showing {alumni.length} Alumni
                    </div>

                    {alumni.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-background/50">
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                No alumni found
                            </h3>
                            <Button variant="link" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {alumni.map((person) => (
                                <Link href={`/alumni/${person.id}`} key={person.id}>
                                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                            <Avatar className="h-12 w-12 border">
                                                <AvatarImage src={person.image || undefined} alt={person.name} />
                                                <AvatarFallback>{getInitials(person.name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1 overflow-hidden">
                                                <CardTitle className="text-base font-semibold truncate">
                                                    {person.name}
                                                </CardTitle>
                                                <CardDescription className="text-xs truncate">
                                                    Class of {person.graduationYear}
                                                </CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <Separator className="mb-4" />
                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 shrink-0" />
                                                    <span className="truncate">
                                                        {person.currentRole || "Alumni"}
                                                        {person.company && ` at ${person.company}`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4 shrink-0" />
                                                    <span className="truncate">{person.course}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 shrink-0" />
                                                    <span className="truncate">{person.location || "N/A"}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
