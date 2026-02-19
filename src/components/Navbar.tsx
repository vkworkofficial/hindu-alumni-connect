"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Alumni Directory", href: "/alumni" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-[1200px] items-center justify-between px-6">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
                        H
                    </div>
                    <span className="font-bold text-xl">Hindu Connect</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="h-6 w-px bg-border mx-2" />
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/login">Admin Login</Link>
                    </Button>
                </nav>

                {/* Mobile Nav */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader className="text-left">
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="mt-8 flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "text-lg font-medium transition-colors hover:text-primary",
                                            pathname === link.href
                                                ? "text-foreground"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Separator />
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-muted-foreground hover:text-primary"
                                >
                                    Admin Login
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
