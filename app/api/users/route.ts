import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import {
    adminDb,
    unauthorizedResponse,
    forbiddenResponse,
    serverErrorResponse,
    successResponse
} from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
    try {
        // Vérifier l'authentification
        const token = getTokenFromRequest(request);
        if (!token) {
            return unauthorizedResponse();
        }

        const payload = verifyToken(token);
        if (!payload) {
            return unauthorizedResponse();
        }

        // Seuls les admins peuvent accéder à cette route
        if (payload.role !== 'admin') {
            return forbiddenResponse();
        }

        // Récupérer les paramètres de pagination
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Calculer le décalage pour la pagination
        const offset = (page - 1) * limit;

        // Récupérer les utilisateurs depuis Firestore
        const usersCollection = adminDb.collection('users');

        // Obtenir le nombre total d'utilisateurs
        const totalSnapshot = await usersCollection.count().get();
        const total = totalSnapshot.data().count;

        // Récupérer les utilisateurs avec pagination
        const snapshot = await usersCollection
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .offset(offset)
            .get();

        // Formatter les données
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            // Retirer le mot de passe
            const { password, ...userWithoutPassword } = data;
            return {
                _id: doc.id,
                ...userWithoutPassword
            };
        });

        // Retourner les données avec les informations de pagination
        return successResponse({
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get users error:', error);
        return serverErrorResponse('Erreur lors de la récupération des utilisateurs', error);
    }
}

// POST - Créer un nouvel utilisateur (optionnel, si nécessaire)
export async function POST(request: NextRequest) {
    try {
        // Vérifier l'authentification
        const token = getTokenFromRequest(request);
        if (!token) {
            return unauthorizedResponse();
        }

        const payload = verifyToken(token);
        if (!payload) {
            return unauthorizedResponse();
        }

        // Seuls les admins peuvent créer des utilisateurs via cette route
        if (payload.role !== 'admin') {
            return forbiddenResponse();
        }

        const data = await request.json();

        // Validation des données requises
        if (!data.email || !data.name) {
            return NextResponse.json(
                { message: 'Email et nom sont requis' },
                { status: 400 }
            );
        }

        // Créer l'utilisateur dans Firebase Auth
        const { adminAuth } = await import('@/lib/firebase-admin');

        try {
            const userRecord = await adminAuth.createUser({
                email: data.email,
                password: data.password || Math.random().toString(36).slice(-8), // Générer un mot de passe aléatoire si non fourni
                displayName: data.name,
                phoneNumber: data.phone,
            });

            // Créer le document utilisateur dans Firestore
            const timestamp = new Date();
            const userData = {
                email: data.email,
                name: data.name,
                phone: data.phone || '',
                role: data.role || 'user',
                createdAt: timestamp,
                updatedAt: timestamp,
            };

            await adminDb.collection('users').doc(userRecord.uid).set(userData);

            // Définir les claims personnalisés
            if (data.role) {
                await adminAuth.setCustomUserClaims(userRecord.uid, { role: data.role });
            }

            return successResponse({
                _id: userRecord.uid,
                ...userData
            }, 'Utilisateur créé avec succès');

        } catch (authError: any) {
            if (authError.code === 'auth/email-already-exists') {
                return NextResponse.json(
                    { message: 'Cet email est déjà utilisé' },
                    { status: 409 }
                );
            }
            throw authError;
        }

    } catch (error) {
        console.error('Create user error:', error);
        return serverErrorResponse('Erreur lors de la création de l\'utilisateur', error);
    }
}