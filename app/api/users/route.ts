import { NextRequest, NextResponse } from 'next/server';
import {
    adminDb,
    verifyFirebaseToken,
    unauthorizedResponse,
    forbiddenResponse
} from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
    try {
        // Vérifier l'authentification Firebase
        const user = await verifyFirebaseToken(request);
        if (!user) {
            return unauthorizedResponse();
        }

        // Vérifier que l'utilisateur est admin
        if (user.role !== 'admin') {
            return forbiddenResponse();
        }

        // Récupérer tous les utilisateurs depuis Firestore
        const usersSnapshot = await adminDb
            .collection('users')
            .orderBy('createdAt', 'desc')
            .get();

        const users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Ne pas renvoyer les données sensibles
            password: undefined,
            mongoId: undefined,
        }));

        return NextResponse.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
} 