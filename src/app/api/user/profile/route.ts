import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = 'force-dynamic';

const MIN_BIO_WORDS = 30;

// POST /api/user/profile - Update user profile
export async function POST(req: Request) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ message: 'Static build bypass' });
    }
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, course, batch, bio } = body;

        // Server-side bio word count validation
        const bioWordCount = (bio || '').trim().split(/\s+/).filter(Boolean).length;
        if (bioWordCount < MIN_BIO_WORDS) {
            return NextResponse.json(
                { error: `Bio must be at least ${MIN_BIO_WORDS} words. Currently: ${bioWordCount}.` },
                { status: 400 }
            );
        }

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name: name || undefined,
                course,
                batch,
                bio,
                isProfileComplete: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("[PROFILE_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
