"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { COURSES } from "@/lib/constants";
import { AlertTriangle } from "lucide-react";

const MIN_BIO_WORDS = 30;

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: session?.user?.name || "",
        course: "",
        batch: "",
        bio: "",
    });

    const bioWordCount = formData.bio.trim().split(/\s+/).filter(Boolean).length;
    const bioTooShort = formData.bio.trim().length > 0 && bioWordCount < MIN_BIO_WORDS;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (bioWordCount < MIN_BIO_WORDS) {
            setError(`Your bio must be at least ${MIN_BIO_WORDS} words long. Currently: ${bioWordCount} words. Please write a more detailed introduction.`);
            return;
        }

        if (!formData.name.trim()) {
            setError("Please enter your full name.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update profile");

            // Update session to reflect new data
            await update({
                ...session,
                user: {
                    ...session?.user,
                    isProfileComplete: true,
                },
            });

            router.push("/");
            router.refresh();
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-lg py-24">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to Hindu Connect</CardTitle>
                    <CardDescription>
                        Complete your profile to start connecting with alumni from Hindu College.
                        All fields are required.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Vedant Kumar"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="course">Course</Label>
                            <Select
                                value={formData.course}
                                onValueChange={(val) => setFormData({ ...formData, course: val })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COURSES.map((course) => (
                                        <SelectItem key={course} value={course}>
                                            {course}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="batch">Graduation Year (Batch)</Label>
                            <Input
                                id="batch"
                                type="number"
                                placeholder="Expected Graduation Year (e.g. 2026)"
                                value={formData.batch}
                                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                required
                                min={1950}
                                max={2030}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="bio">Bio</Label>
                                <span className={`text-xs ${bioTooShort ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                                    {bioWordCount}/{MIN_BIO_WORDS} words min
                                </span>
                            </div>
                            <Textarea
                                id="bio"
                                placeholder="Tell us about yourself — your academic interests, career goals, extracurricular activities, and what you hope to gain from connecting with alumni. Be detailed, this helps alumni understand your background."
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={5}
                                required
                            />
                            {bioTooShort && (
                                <p className="text-xs text-destructive">
                                    Please write at least {MIN_BIO_WORDS} words. You&apos;re at {bioWordCount} — add more detail about your interests and goals.
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading || bioTooShort}>
                            {loading ? "Saving..." : "Complete Profile"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
