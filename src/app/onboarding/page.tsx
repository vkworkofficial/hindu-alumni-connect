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
import { COURSES } from "@/lib/constants";

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        course: "",
        batch: "",
        bio: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
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
                        Please complete your profile to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us a bit about yourself..."
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Saving..." : "Complete Profile"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
