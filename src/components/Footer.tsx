import Link from "next/link";
import { Mail, Linkedin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container max-w-[1200px] px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
                    {/* Brand Column (Span 4) */}
                    <div className="md:col-span-5 lg:col-span-4">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs">
                                H
                            </div>
                            <span className="text-base font-bold tracking-tight">Hindu Connect</span>
                        </Link>
                        <p className="mb-6 text-sm leading-relaxed text-muted-foreground max-w-xs">
                            Connecting students with accomplished alumni for mentorship, career
                            guidance, and networking opportunities.
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground">
                                <Globe className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Spacer (Span 2/3) */}
                    <div className="hidden md:block md:col-span-1 lg:col-span-3" />

                    {/* Links Column 1 (Span 2) */}
                    <div className="md:col-span-3 lg:col-span-2">
                        <h4 className="mb-3 text-sm font-semibold tracking-wider uppercase text-foreground/90">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/alumni" className="hover:text-primary transition-colors">Alumni Directory</Link></li>
                            <li><Link href="/login" className="hover:text-primary transition-colors">Admin Portal</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 (Span 3) */}
                    <div className="md:col-span-3 lg:col-span-3">
                        <h4 className="mb-3 text-sm font-semibold tracking-wider uppercase text-foreground/90">Resources</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Mentorship Program</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Career Guidance</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Internship Portal</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Hindu Connect. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
