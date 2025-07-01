import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Configuration Firebase Admin
const firebaseAdminConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialiser Firebase Admin seulement si pas déjà initialisé
if (!getApps().length) {
    initializeApp({
        credential: cert(firebaseAdminConfig),
    });
}

// Exporter les services
export const adminAuth = getAuth();
export const adminDb = getFirestore();

// Configurer les paramètres Firestore
adminDb.settings({ ignoreUndefinedProperties: true });

// Collections
export const COLLECTIONS = {
    USERS: 'users',
    TICKETS: 'tickets',
    MESSAGES: 'messages',
} as const;

// Helper pour obtenir un timestamp serveur
export const serverTimestamp = () => {
    return new Date().toISOString();
};