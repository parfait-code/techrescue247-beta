// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { UsersService } from '@/lib/services/users.service';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validation des données d'entrée
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email et mot de passe sont requis' },
                { status: 400 }
            );
        }

        // Trouver l'utilisateur par email AVEC le mot de passe
        const user = await UsersService.findByEmailWithPassword(email.toLowerCase().trim());
        if (!user) {
            return NextResponse.json(
                { message: 'Email ou mot de passe incorrect' },
                { status: 401 }
            );
        }

        // Vérifier que le mot de passe existe dans la base de données
        if (!user.password) {
            console.error('User found but no password in database for email:', email);

            // Cas spécial : utilisateur créé sans mot de passe (problème de migration)
            // Suggérer de réinitialiser le mot de passe
            return NextResponse.json(
                {
                    message: 'Votre compte nécessite une réinitialisation de mot de passe. Veuillez utiliser "Mot de passe oublié".',
                    code: 'PASSWORD_RESET_REQUIRED'
                },
                { status: 400 }
            );
        }

        // Vérifier le mot de passe
        const isPasswordValid = await UsersService.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Email ou mot de passe incorrect' },
                { status: 401 }
            );
        }

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
    } catch (error: any) {
        console.error('Login error:', error);

        // Gestion des erreurs spécifiques
        if (error.code === 'auth/user-not-found') {
            return NextResponse.json(
                { message: 'Email ou mot de passe incorrect' },
                { status: 401 }
            );
        }

        if (error.code === 'auth/wrong-password') {
            return NextResponse.json(
                { message: 'Email ou mot de passe incorrect' },
                { status: 401 }
            );
        }

        if (error.code === 'auth/too-many-requests') {
            return NextResponse.json(
                { message: 'Trop de tentatives. Veuillez réessayer plus tard.' },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}