import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);

        if (!token) {
            return NextResponse.json(
                { message: 'Token non fourni' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json(
                { message: 'Token invalide' },
                { status: 401 }
            );
        }

        await dbConnect();

        // Récupérer les informations utilisateur actualisées
        const user = await User.findById(payload.userId).select('-password');

        if (!user) {
            return NextResponse.json(
                { message: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Verify token error:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}