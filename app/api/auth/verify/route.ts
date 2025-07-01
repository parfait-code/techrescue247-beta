import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { UsersService } from '@/lib/services/users.service';

export async function GET(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ message: 'Token invalide' }, { status: 401 });
        }

        // Récupérer les informations utilisateur mises à jour
        const user = await UsersService.findById(payload.userId);
        if (!user) {
            return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
        }

        // Ne pas renvoyer le mot de passe
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json({
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Verify error:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}