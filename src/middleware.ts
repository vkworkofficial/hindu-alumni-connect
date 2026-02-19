import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || 'hindu-alumni-secret-key-change-in-production',
    });

    const { pathname } = request.nextUrl;

    // 1. Protect Admin Routes
    if (pathname.startsWith('/admin')) {
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
        // Optional: Check for ADMIN role
        if (token.role !== 'ADMIN' && token.role !== 'SUPERADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 2. Onboarding Logic for Students
    // If logged in, Student, and profile NOT complete -> Force /onboarding
    if (token && token.role === 'STUDENT' && !token.isProfileComplete) {
        if (pathname !== '/onboarding' && !pathname.startsWith('/api') && pathname !== '/login') {
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }
    }

    // 3. Protect /onboarding
    // If not logged in -> Login
    if (pathname === '/onboarding') {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        // If already complete -> Home
        if (token.isProfileComplete) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 4. Redirect logged-in users away from login page
    if (pathname === '/login' && token) {
        if (token.role === 'ADMIN' || token.role === 'SUPERADMIN') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/login',
        '/onboarding',
        // Match all paths that might need onboarding protection (mostly public ones if we want to force it everywhere)
        // For now, let's strictly protect specific flows or rely on the check above for visited pages
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
