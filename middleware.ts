import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Public paths that don't require authentication
    const publicPaths = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register'];

    if (publicPaths.includes(path)) {
        return NextResponse.next();
    }

    // Get token from cookie
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = verifyToken(token);

    if (!payload) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Admin-only paths
    if (path.startsWith('/admin') && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/api/tickets/:path*',
        '/api/users/:path*',
    ],
};