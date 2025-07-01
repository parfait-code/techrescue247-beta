import { NextRequest, NextResponse } from 'next/server';
import { UsersService } from '@/lib/services/users.service';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, password } = await request.json();

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await UsersService.findByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { message: 'Un utilisateur avec cet email existe déjà' },
                { status: 400 }
            );
        }

        // Créer l'utilisateur
        const user = await UsersService.create({
            name,
            email,
            phone,
            password,
            role: 'user',
        });

        // Générer le token JWT
        const token = generateToken({
            userId: user.id!,
            email: user.email,
            role: user.role,
        });

        // Ne pas renvoyer le mot de passe
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            token,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}