import Link from "next/link";
import {
  ArrowRight,
  Users,
  Handshake,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Data
const stats = [
  { number: "500+", label: "Alumni Members" },
  { number: "50+", label: "Partner Companies" },
  { number: "200+", label: "Mentorships" },
  { number: "15+", label: "Industries" },
];

const features = [
  {
    title: "Alumni Network",
    description: "Access a diverse community of professionals across tech, finance, and creative fields.",
    icon: Users,
  },
  {
    title: "Mentorship",
    description: "Get waiting-list access to 1-on-1 mentorship with senior industry leaders.",
    icon: Handshake,
  },
  {
    title: "Career Guidance",
    description: "Exclusive webinars and workshops on navigating your early career path.",
    icon: TrendingUp,
  },
  {
    title: "Internships",
    description: "Direct referrals and internship opportunities at top-tier companies.",
    icon: Briefcase,
  },
  {
    title: "Networking",
    description: "Build meaningful relationships that extend beyond the campus walls.",
    icon: Share2,
  },
  {
    title: "Knowledge Sharing",
    description: "Learn from real-world case studies and industry insights.",
    icon: GraduationCap,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-12 md:py-16 lg:py-24">
          {/* Background Radial (Subtle) */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

          <div className="container mx-auto max-w-[1200px] px-6">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-center">
              {/* Content (Span 7) */}
              <div className="flex flex-col items-start gap-6 md:col-span-12 lg:col-span-7">
                <Badge variant="secondary" className="px-3 py-1 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
                  HINDU CONNECT 2026
                </Badge>

                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl max-w-2xl">
                  Where Alumni <span className="text-primary">Inspire</span> the Next Generation
                </h1>

                <p className="text-lg text-muted-foreground sm:text-xl max-w-[640px] leading-relaxed">
                  Connect with accomplished alumni for mentorship, career guidance,
                  internship opportunities, and professional networking.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <Button size="lg" className="h-12 px-8 text-base" asChild>
                    <Link href="/alumni">
                      Browse Alumni <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Learn More
                  </Button>
                </div>

                <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px]">
                        {/* Placeholder avatars */}
                      </div>
                    ))}
                  </div>
                  <p>Joined by 500+ successful graduates</p>
                </div>
              </div>

              {/* Visual (Span 5) - Optional Graphic */}
              <div className="hidden lg:col-span-5 lg:flex lg:justify-end">
                <div className="relative h-[480px] w-full max-w-[400px] rounded-2xl border bg-muted/20 p-4 shadow-sm">
                  <div className="h-full w-full rounded-xl bg-gradient-to-br from-background to-muted border border-border/50 shadow-inner flex items-center justify-center">
                    <p className="text-sm text-muted-foreground font-medium">Hero Visual / Dashboard Mockup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS SECTION */}
        <section className="border-y bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto max-w-[1200px] px-6">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-start p-4 md:border-l md:pl-8 first:border-0 last:border-0">
                  <span className="text-4xl font-bold tracking-tight text-foreground">{stat.number}</span>
                  <span className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-12 md:py-16 lg:py-24">
          <div className="container mx-auto max-w-[1200px] px-6">
            <div className="mb-12 md:mb-16 max-w-[720px]">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Why Connect With Our Alumni?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our alumni network offers a wealth of experience and opportunities to
                help you succeed in your academic and professional journey.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <Card key={i} className="transition-all hover:shadow-md hover:border-primary/20">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="leading-tight">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-12 md:py-24 bg-muted/30 border-t">
          <div className="container mx-auto max-w-[1200px] px-6">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center shadow-xl sm:px-16 md:py-24">
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-6">
                  Ready to Shape Your Future?
                </h2>
                <p className="text-lg text-primary-foreground/90 mb-10 max-w-xl mx-auto">
                  Join hundreds of students and alumni building the next generation of leaders.
                </p>
                <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold" asChild>
                  <Link href="/alumni">
                    Explore Alumni Directory
                  </Link>
                </Button>
              </div>

              {/* Background Pattern */}
              <div className="absolute top-0 left-0 -z-0 h-full w-full opacity-10">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
