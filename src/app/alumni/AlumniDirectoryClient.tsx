"use client";

import { useState, useCallback } from "react";
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
    course: string;
    graduationYear: number;
    currentRole?: string;
    company?: string;
    domain?: string;
    location?: string;
    image?: string | null;
}

interface Props {
    alumni: Alumni[];
    courses: string[];
    domains: string[];
    years: number[];
    initialFilters: {
        search: string;
        course: string;
        domain: string;
        year: string;
    };
}

export default function AlumniDirectoryClient({
    alumni,
    courses,
    domains,
    years,
    initialFilters,
}: Props) {
    const router = useRouter();
    const [filters, setFilters] = useState(initialFilters);

    const updateFilter = useCallback((field: string, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    }, []);

    const applyFilters = useCallback(() => {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.course && filters.course !== "all") params.set("course", filters.course);
        if (filters.domain && filters.domain !== "all") params.set("domain", filters.domain);
        if (filters.year && filters.year !== "all") params.set("year", filters.year);

        router.push(`/alumni?${params.toString()}`);
    }, [filters, router]);

    const clearFilters = useCallback(() => {
        setFilters({
            search: "",
            course: "",
            domain: "",
            year: "",
        });
        router.push("/alumni");
    }, [router]);

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    const hasActiveFilters = filters.search || (filters.course && filters.course !== "all") || (filters.domain && filters.domain !== "all") || (filters.year && filters.year !== "all");

    return (
        <div className="flex flex-col flex-1">
            {/* Search and Hero Section */}
            <section className="bg-card pt-20 pb-16 border-b">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col gap-8">
                        <div className="space-y-4 text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                Alumni Directory
                            </h1>
                            <p className="max-w-[700px] text-muted-foreground text-lg">
                                Reconnect with your peers, discover industry mentors, and forge professional connections within the Hindu Alumni community.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, company, or role..."
                                    value={filters.search}
                                    onChange={(e) => updateFilter("search", e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                                    className="pl-10 h-11"
                                />
                            </div>
                            <Button size="lg" onClick={applyFilters} className="h-11 px-8">
                                Search
                            </Button>
                        </div>

                        {/* Dropdown Filters */}
                        <div className="flex flex-wrap gap-4 items-center pt-2">
                            <Select
                                value={filters.course || "all"}
                                onValueChange={(v) => { updateFilter("course", v); setTimeout(applyFilters, 0); }}
                            >
                                <SelectTrigger className="w-[180px] bg-background">
                                    <SelectValue placeholder="All Courses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Courses</SelectItem>
                                    {courses.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.domain || "all"}
                                onValueChange={(v) => { updateFilter("domain", v); setTimeout(applyFilters, 0); }}
                            >
                                <SelectTrigger className="w-[180px] bg-background">
                                    <SelectValue placeholder="All Industries" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Industries</SelectItem>
                                    {domains.map((d) => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.year || "all"}
                                onValueChange={(v) => { updateFilter("year", v); setTimeout(applyFilters, 0); }}
                            >
                                <SelectTrigger className="w-[140px] bg-background">
                                    <SelectValue placeholder="All Years" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Years</SelectItem>
                                    {years.map((y) => (
                                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    onClick={clearFilters}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Grid */}
            <main className="bg-slate-50/50 flex-1 py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Showing {alumni.length} results
                        </h2>
                    </div>

                    {alumni.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-background/50 text-center">
                            <div className="bg-muted p-4 rounded-full mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No alumni found</h3>
                            <p className="text-muted-foreground mb-6 max-w-xs">
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                            <Button variant="outline" onClick={clearFilters}>
                                Reset all filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {alumni.map((person) => (
                                <Link
                                    href={`/alumni/${person.id}`}
                                    key={person.id}
                                    className="group"
                                >
                                    <Card className="h-full border border-border/50 transition-all duration-300 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1">
                                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                                            <Avatar className="h-14 w-14 ring-2 ring-background ring-offset-2 ring-offset-slate-100 group-hover:ring-primary/20 transition-all">
                                                <AvatarImage src={person.image || undefined} alt={person.name} />
                                                <AvatarFallback className="text-lg font-bold bg-slate-100 text-slate-900">
                                                    {getInitials(person.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                                    {person.name}
                                                </CardTitle>
                                                <CardDescription className="text-xs font-medium bg-slate-100 w-fit px-2 py-0.5 rounded-full">
                                                    Class of {person.graduationYear}
                                                </CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <Separator className="mb-4 opacity-50" />
                                            <div className="space-y-3 text-sm">
                                                <div className="flex items-start gap-3 text-foreground/80">
                                                    <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                                    <span className="leading-tight">
                                                        <span className="font-semibold text-foreground">
                                                            {person.currentRole || "Alumni"}
                                                        </span>
                                                        {person.company && <><br /><span className="text-xs text-muted-foreground">{person.company}</span></>}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-muted-foreground">
                                                    <GraduationCap className="h-4 w-4 shrink-0" />
                                                    <span className="truncate">{person.course}</span>
                                                </div>
                                                {person.location && (
                                                    <div className="flex items-center gap-3 text-muted-foreground">
                                                        <MapPin className="h-4 w-4 shrink-0" />
                                                        <span className="truncate">{person.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
