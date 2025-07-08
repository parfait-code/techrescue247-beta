// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuthService } from '@/lib/services/google-auth.service';

export async function POST(request: NextRequest) {
    try {
        const { method } = await request.json();

        if (method === 'redirect-result') {
            // Gérer le retour de redirection
            const result = await GoogleAuthService.getRedirectResult();

            if (!result) {
                return NextResponse.json(
                    { message: 'Aucun résultat de connexion' },
                    { status: 400 }
                );
            }

            return NextResponse.json(result);
        }

        // Par défaut, utiliser la popup
        const result = await GoogleAuthService.signInWithPopup();
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Google auth error:', error);
        return NextResponse.json(
            { message: error.message || 'Erreur lors de la connexion avec Google' },
            { status: 500 }
        );
    }
}