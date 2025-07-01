import { NextRequest, NextResponse } from 'next/server';
import { UsersService } from '@/lib/services/users.service';

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, password } = await request.json();

        // Créer le nouvel utilisateur
        const user = await UsersService.create({
            name,
            email,
            phone,
            password,
            role: 'user',
        });

        // Ne pas renvoyer le mot de passe
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            message: 'Compte créé avec succès',
            user: userWithoutPassword,
        });
    } catch (error: any) {
        console.error('Register error:', error);

        // Gérer les erreurs spécifiques
        if (error.message === 'Cet email est déjà utilisé') {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Erreur lors de la création du compte' },
            { status: 500 }
        );
    }
}