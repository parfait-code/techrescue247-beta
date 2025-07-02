import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/messages', // POST uniquement
    '/api/contact',
];

// Routes qui nécessitent le rôle admin
const adminRoutes = [
    '/api/users',
    '/api/admin',
];

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Vérifier si c'est une route API
    if (!pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Permettre les routes publiques
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        // Pour /api/messages, vérifier la méthode
        if (pathname === '/api/messages' && request.method !== 'POST') {
            // GET sur /api/messages nécessite l'authentification
            const authHeader = request.headers.get('authorization');
            if (!authHeader) {
                return NextResponse.json(
                    { message: 'Authorization header required' },
                    { status: 401 }
                );
            }
        }
        return NextResponse.next();
    }

    // Vérifier l'en-tête Authorization pour les routes protégées
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
        // Retourner une réponse JSON avec le bon Content-Type
        return NextResponse.json(
            { message: 'Authorization header required' },
            { status: 401 }
        );
    }

    // Continuer avec la requête
    const response = NextResponse.next();

    // S'assurer que toutes les réponses API ont le bon Content-Type
    response.headers.set('Content-Type', 'application/json');

    return response;
}

export const config = {
    matcher: '/api/:path*',
};