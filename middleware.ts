// 1. CORRECTION DU MIDDLEWARE (middleware.ts)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/contact',
];

// Routes qui permettent POST sans auth mais GET avec auth
const mixedRoutes = ['/api/messages'];

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Vérifier si c'est une route API
    if (!pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Permettre les routes complètement publiques
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Gestion spéciale pour /api/messages
    if (pathname === '/api/messages' && request.method === 'POST') {
        return NextResponse.next(); // POST autorisé sans auth
    }

    // Pour toutes les autres routes, vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('authToken')?.value;

    // Accepter le token depuis l'header OU les cookies
    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    if (!token) {
        return NextResponse.json(
            { message: 'Token d\'authentification requis' },
            {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    // Optionnel : Vérifier la validité du token
    // try {
    //     if (process.env.JWT_SECRET) {
    //         jwt.verify(token, process.env.JWT_SECRET);
    //     }
    // } catch (error) {
    //     return NextResponse.json(
    //         { message: 'Token invalide ou expiré' },
    //         { 
    //             status: 401,
    //             headers: { 'Content-Type': 'application/json' }
    //         }
    //     );
    // }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};