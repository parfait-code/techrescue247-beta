// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { UsersService } from '@/lib/services/users.service';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, password } = await request.json();

        // Validation des données d'entrée
        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                { message: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Email invalide' },
                { status: 400 }
            );
        }

        // Validation du mot de passe
        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Le mot de passe doit contenir au moins 6 caractères' },
                { status: 400 }
            );
        }

        // Vérifier si l'utilisateur existe déjà DANS FIRESTORE
        const existingUser = await UsersService.findByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { message: 'Un utilisateur avec cet email existe déjà' },
                { status: 400 }
            );
        }

        // Créer l'utilisateur (Firebase Auth + Firestore)
        const user = await UsersService.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
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
    } catch (error: any) {
        console.error('Register error:', error);

        // Gestion des erreurs spécifiques Firebase
        if (error.code === 'auth/email-already-exists') {
            return NextResponse.json(
                { message: 'Cet email est déjà utilisé' },
                { status: 400 }
            );
        }

        if (error.code === 'auth/weak-password') {
            return NextResponse.json(
                { message: 'Le mot de passe est trop faible' },
                { status: 400 }
            );
        }

        if (error.code === 'auth/invalid-email') {
            return NextResponse.json(
                { message: 'Email invalide' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}