import { Timestamp } from 'firebase/firestore';

// Types de base Firestore
export interface FirestoreTimestamps {
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Interface utilisateur Firestore
export interface FirestoreUser {
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    mongoId?: string; // Pour la migration
    migratedAt?: Timestamp;
}

// Interface ticket Firestore
export interface FirestoreTicket extends FirestoreTimestamps {
    userId: string;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    phone: string;
    screenshots: string[];
    mongoId?: string; // Pour la migration
}

// Interface message Firestore
export interface FirestoreMessage extends FirestoreTimestamps {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    repliedAt?: Timestamp;
    adminNotes?: string;
    mongoId?: string; // Pour la migration
}

// Types pour l'application (avec ID et dates JS)
export interface User extends Omit<FirestoreUser, keyof FirestoreTimestamps> {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Ticket extends Omit<FirestoreTicket, keyof FirestoreTimestamps> {
    id: string;
    user?: User; // Populated user
    createdAt: Date;
    updatedAt: Date;
}

export interface Message extends Omit<FirestoreMessage, keyof FirestoreTimestamps | 'repliedAt'> {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    repliedAt?: Date;
}

// Helpers pour la conversion
export const timestampToDate = (timestamp: Timestamp | undefined): Date | undefined => {
    return timestamp ? timestamp.toDate() : undefined;
};

export const dateToTimestamp = (date: Date | undefined): Timestamp | undefined => {
    return date ? Timestamp.fromDate(date) : undefined;
};