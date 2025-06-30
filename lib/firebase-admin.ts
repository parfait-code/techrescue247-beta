import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { NextRequest } from 'next/server';

// Initialiser Firebase Admin
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!,
            //   privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')!,
        }),
    });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();

// Type pour l'utilisateur vérifié
export interface VerifiedUser {
    uid: string;
    email: string;
    role: 'user' | 'admin';
}

// Middleware pour vérifier le token Firebase
export async function verifyFirebaseToken(
    request: NextRequest
): Promise<VerifiedUser | null> {
    try {
        // Récupérer le token depuis l'en-tête Authorization
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.substring(7);

        // Vérifier le token avec Firebase Admin
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Récupérer les données utilisateur depuis Firestore
        const userDoc = await adminDb
            .collection('users')
            .doc(decodedToken.uid)
            .get();

        if (!userDoc.exists) {
            return null;
        }

        const userData = userDoc.data();

        return {
            uid: decodedToken.uid,
            email: decodedToken.email || userData?.email,
            role: userData?.role || 'user',
        };
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return null;
    }
}

// Helper pour créer une réponse d'erreur
export function unauthorizedResponse(message: string = 'Non autorisé') {
    return new Response(
        JSON.stringify({ message }),
        {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        }
    );
}

// Helper pour créer une réponse interdite
export function forbiddenResponse(message: string = 'Accès refusé') {
    return new Response(
        JSON.stringify({ message }),
        {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        }
    );
}