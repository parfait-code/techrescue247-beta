import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';

// Configuration Firebase Admin
const firebaseAdminConfig = {
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Remplacer les \n par des sauts de ligne
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
};

// Initialiser Firebase Admin (singleton)
let adminApp: App;

if (!getApps().length) {
    adminApp = initializeApp(firebaseAdminConfig);
} else {
    adminApp = getApps()[0];
}

// Exporter les services Firebase
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);

// Définir TOUTES les collections nécessaires
export const COLLECTIONS = {
    MESSAGES: 'messages',
    USERS: 'users',
    TICKETS: 'tickets', // AJOUT DE LA COLLECTION TICKETS
} as const;

// Helper pour les timestamps Firebase
export const serverTimestamp = () => FieldValue.serverTimestamp();

/**
 * Vérifier un token Firebase ID
 */
export async function verifyFirebaseToken(idToken: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return null;
    }
}

/**
 * Créer une réponse 401 Unauthorized
 */
export function unauthorizedResponse(message: string = 'Non autorisé') {
    return NextResponse.json(
        { message, error: 'Unauthorized' },
        { status: 401 }
    );
}

/**
 * Créer une réponse 403 Forbidden
 */
export function forbiddenResponse(message: string = 'Accès refusé') {
    return NextResponse.json(
        { message, error: 'Forbidden' },
        { status: 403 }
    );
}

/**
 * Créer une réponse d'erreur serveur
 */
export function serverErrorResponse(
    message: string = 'Erreur serveur',
    error?: any
) {
    console.error('Server error:', error);
    return NextResponse.json(
        {
            message,
            error: 'Internal Server Error',
            details: process.env.NODE_ENV === 'development' ? error?.message : undefined
        },
        { status: 500 }
    );
}

/**
 * Créer une réponse 404 Not Found
 */
export function notFoundResponse(message: string = 'Ressource non trouvée') {
    return NextResponse.json(
        { message, error: 'Not Found' },
        { status: 404 }
    );
}

/**
 * Créer une réponse de succès
 */
export function successResponse(data: any, message?: string) {
    const response: any = { success: true };

    if (message) {
        response.message = message;
    }

    if (data !== undefined) {
        response.data = data;
    }

    return NextResponse.json(response);
}

/**
 * Obtenir un utilisateur par UID Firebase
 */
export async function getFirebaseUser(uid: string) {
    try {
        const userRecord = await adminAuth.getUser(uid);
        return userRecord;
    } catch (error) {
        console.error('Error fetching Firebase user:', error);
        return null;
    }
}

/**
 * Créer un utilisateur personnalisé dans Firestore
 */
export async function createUserInFirestore(userData: {
    uid: string;
    email: string;
    name: string;
    phone?: string;
    role?: 'user' | 'admin';
}) {
    try {
        const userRef = adminDb.collection(COLLECTIONS.USERS).doc(userData.uid);
        const timestamp = new Date();

        await userRef.set({
            ...userData,
            role: userData.role || 'user',
            createdAt: timestamp,
            updatedAt: timestamp,
        });

        return userRef;
    } catch (error) {
        console.error('Error creating user in Firestore:', error);
        throw error;
    }
}