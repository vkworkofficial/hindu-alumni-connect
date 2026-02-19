"use client";

import { useState, useRef, useCallback } from "react";
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
import {
    Loader2,
    CheckCircle2,
    ArrowLeft,
    Send,
    ShieldCheck,
    Mail,
    Upload,
    FileText,
    X,
    AlertTriangle,
    Lightbulb,
    Paperclip,
    MessageSquare,
} from "lucide-react";

interface Alumni {
    id: string;
    name: string;
    currentRole?: string;
    company?: string;
    image?: string | null;
}

interface ConnectFormProps {
    alumni: Alumni;
    userName: string;
    userEmail: string;
}

const categories = [
    { value: "MENTORSHIP", label: "Mentorship Inquiry" },
    { value: "CAREER_GUIDANCE", label: "Career Guidance" },
    { value: "INTERNSHIP", label: "Internship Opportunity" },
    { value: "NETWORKING", label: "Professional Networking" },
    { value: "OTHER", label: "Other Inquiry" },
];

const MIN_MESSAGE_CHARS = 100;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_EXTENSIONS = ".pdf, .doc, .docx";

export default function ConnectFormClient({ alumni, userName, userEmail }: ConnectFormProps) {
    const [formData, setFormData] = useState({
        studentName: userName,
        studentEmail: userEmail,
        subject: "",
        message: "",
        category: "",
    });
    const [attachment, setAttachment] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const messageCharCount = formData.message.length;
    const messageTooShort = formData.message.length > 0 && messageCharCount < MIN_MESSAGE_CHARS;

    const handleChange = (field: string) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, category: value }));
    };

    const handleFileSelect = useCallback((file: File) => {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            setError(`Invalid file type. Only ${ALLOWED_EXTENSIONS} files are accepted.`);
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            setError("File is too large. Maximum size is 5MB.");
            return;
        }
        setError("");
        setAttachment(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const removeAttachment = () => {
        setAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (messageCharCount < MIN_MESSAGE_CHARS) {
            setError(`Your message must be at least ${MIN_MESSAGE_CHARS} characters. Currently: ${messageCharCount}. Please provide more detail about your request.`);
            return;
        }

        setLoading(true);

        try {
            let attachmentData = undefined;
            if (attachment) {
                const base64 = await toBase64(attachment);
                attachmentData = {
                    name: attachment.name,
                    type: attachment.type,
                    size: attachment.size,
                    data: base64,
                };
            }

            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    alumniId: alumni.id,
                    attachment: attachmentData,
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
                    Back to {alumni.name.split(' ')[0]}&apos;s Profile
                </Link>

                <div className="grid gap-10 lg:grid-cols-3">
                    {/* Header/Info Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black tracking-tight leading-none text-foreground">
                                Send a <span className="text-primary">Connection</span> Request
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Reach out to {alumni.name.split(' ')[0]} with a thoughtful, detailed introduction.
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

                        {/* Professional Conduct & Guidelines */}
                        <div className="space-y-4">
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-3">
                                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                    <ShieldCheck className="h-4 w-4" />
                                    Professional Conduct
                                </div>
                                <ul className="text-xs text-muted-foreground leading-normal space-y-2">
                                    <li>• Be respectful and professional in your communication</li>
                                    <li>• Introduce yourself clearly — name, course, year</li>
                                    <li>• Avoid generic or one-line requests</li>
                                    <li>• Do not spam multiple alumni with identical messages</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-3">
                                <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                                    <Lightbulb className="h-4 w-4" />
                                    Tips for a Great Request
                                </div>
                                <ul className="text-xs text-amber-800/80 leading-normal space-y-2">
                                    <li>• <strong>Be specific</strong> — explain exactly what guidance you need</li>
                                    <li>• <strong>Show effort</strong> — mention what you&apos;ve already researched or tried</li>
                                    <li>• <strong>Attach your CV</strong> — helps alumni understand your background quickly</li>
                                    <li>• <strong>Keep it focused</strong> — one clear ask per request</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
                                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                                    <MessageSquare className="h-4 w-4" />
                                    What to Include
                                </div>
                                <ul className="text-xs text-blue-800/80 leading-normal space-y-2">
                                    <li>• Your current academic year and course</li>
                                    <li>• Why you&apos;re reaching out to this specific alumni</li>
                                    <li>• Your career interests and goals</li>
                                    <li>• Any relevant projects, internships, or experience</li>
                                    <li>• Specific questions you have for them</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Area */}
                    <div className="lg:col-span-2">
                        {error && (
                            <Alert variant="destructive" className="mb-8 border-none shadow-md">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle className="font-bold uppercase tracking-wider text-xs">Error</AlertTitle>
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
                                                readOnly={!!userName}
                                                className={`bg-slate-50 border-slate-200 h-11 focus:bg-white transition-colors ${userName ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            />
                                            {userName && (
                                                <p className="text-xs text-muted-foreground">Auto-filled from your profile</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="studentEmail" className="font-bold text-foreground">Your Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="studentEmail"
                                                    type="email"
                                                    placeholder="email@hinducollege.ac.in"
                                                    value={formData.studentEmail}
                                                    onChange={handleChange("studentEmail")}
                                                    required
                                                    readOnly={!!userEmail}
                                                    className={`bg-slate-50 border-slate-200 h-11 pl-10 focus:bg-white transition-colors ${userEmail ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                />
                                            </div>
                                            {userEmail && (
                                                <p className="text-xs text-muted-foreground">Auto-filled from your account</p>
                                            )}
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
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="message" className="font-bold text-foreground">Your Message</Label>
                                            <span className={`text-xs ${messageTooShort ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                                                {messageCharCount}/{MIN_MESSAGE_CHARS} chars min
                                            </span>
                                        </div>
                                        <Textarea
                                            id="message"
                                            placeholder={`Dear ${alumni.name.split(' ')[0]},\n\nI am a [Year] student studying [Course] at Hindu College. I came across your profile and was impressed by your work at ${alumni.company || 'your company'}.\n\nI am reaching out because... [explain your specific request, what you've tried so far, and how they can help].\n\nThank you for your time.\n\nBest regards,\n${userName || 'Your Name'}`}
                                            value={formData.message}
                                            onChange={handleChange("message")}
                                            className="min-h-[200px] bg-slate-50 border-slate-200 focus:bg-white transition-colors p-4 leading-relaxed"
                                            required
                                        />
                                        {messageTooShort && (
                                            <p className="text-xs text-destructive">
                                                Please write at least {MIN_MESSAGE_CHARS} characters. You&apos;re at {messageCharCount}. Be specific about your request and background.
                                            </p>
                                        )}
                                    </div>

                                    {/* File Upload Area */}
                                    <div className="space-y-2">
                                        <Label className="font-bold text-foreground flex items-center gap-2">
                                            <Paperclip className="h-4 w-4" />
                                            Attachment (Optional)
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Upload your CV or resume to give the alumni context about your background. Max 5MB, PDF/DOC/DOCX only.
                                        </p>

                                        {attachment ? (
                                            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                                                <FileText className="h-8 w-8 text-green-600 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-green-800 truncate">{attachment.name}</p>
                                                    <p className="text-xs text-green-600">
                                                        {(attachment.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={removeAttachment}
                                                    className="text-green-700 hover:text-red-600 hover:bg-red-50 shrink-0"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div
                                                onDrop={handleDrop}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isDragOver
                                                        ? 'border-primary bg-primary/5 scale-[1.02]'
                                                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                                                    }`}
                                            >
                                                <Upload className={`h-8 w-8 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {isDragOver ? 'Drop your file here' : 'Drag & drop your CV here'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        or <span className="text-primary font-medium underline">click to browse</span> • PDF, DOC, DOCX up to 5MB
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept={ALLOWED_EXTENSIONS}
                                            onChange={handleFileInput}
                                            className="hidden"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all"
                                        disabled={loading || messageTooShort}
                                    >
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
