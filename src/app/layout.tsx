import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hindu Connect",
  description: "Connect with accomplished alumni.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen bg-background text-foreground")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
