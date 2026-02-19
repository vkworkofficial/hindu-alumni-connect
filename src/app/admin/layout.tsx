"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    Menu,
    LogOut,
    UserCog,
} from "lucide-react";

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

const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Alumni", href: "/admin/alumni", icon: Users },
    { label: "Requests", href: "/admin/requests", icon: MessageSquare },
    { label: "Users", href: "/admin/users", icon: UserCog },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    // If not authenticated or not admin, we might redirect (but middleware handles this usually)
    // For now, assume protected.

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-50 border-r">
            <div className="p-6">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        H
                    </div>
                    Hindu Connect
                </div>
                <div className="text-xs text-muted-foreground mt-1 ml-10">Admin Panel</div>
            </div>
            <Separator />
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {session?.user?.name?.[0] || "A"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{session?.user?.name || "Admin"}</p>
                        <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 fixed inset-y-0 z-50">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background px-4 py-3 flex items-center justify-between">
                <div className="font-bold flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs">H</div>
                    Admin
                </div>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:pl-64 pt-16 md:pt-0">
                <div className="container p-6 md:p-10 max-w-6xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
