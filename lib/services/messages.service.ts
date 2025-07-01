import { adminDb, COLLECTIONS, serverTimestamp } from '@/lib/firebase-admin';

export interface Message {
    id?: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    repliedAt?: string;
    adminNotes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export class MessagesService {
    private static collection = adminDb.collection(COLLECTIONS.MESSAGES);

    // Créer un message
    static async create(messageData: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Message> {
        try {
            const messageDoc = {
                ...messageData,
                status: 'new' as const,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const docRef = await this.collection.add(messageDoc);

            return {
                id: docRef.id,
                ...messageDoc,
            };
        } catch (error) {
            console.error('Error creating message:', error);
            throw error;
        }
    }

    // Obtenir un message par ID
    static async findById(id: string): Promise<Message | null> {
        try {
            const doc = await this.collection.doc(id).get();

            if (!doc.exists) {
                return null;
            }

            return {
                id: doc.id,
                ...doc.data(),
            } as Message;
        } catch (error) {
            console.error('Error finding message:', error);
            throw error;
        }
    }

    // Obtenir tous les messages
    static async findAll(): Promise<Message[]> {
        try {
            const snapshot = await this.collection
                .orderBy('createdAt', 'desc')
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as Message));
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    // Mettre à jour un message
    static async update(id: string, data: Partial<Message>): Promise<Message | null> {
        try {
            const updateData: any = {
                ...data,
                updatedAt: serverTimestamp(),
            };

            // Si le statut passe à "replied", ajouter la date de réponse
            if (data.status === 'replied' && !data.repliedAt) {
                updateData.repliedAt = serverTimestamp();
            }

            await this.collection.doc(id).update(updateData);

            return this.findById(id);
        } catch (error) {
            console.error('Error updating message:', error);
            throw error;
        }
    }

    // Supprimer un message
    static async delete(id: string): Promise<boolean> {
        try {
            await this.collection.doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }

    // Obtenir les statistiques des messages
    static async getStats(): Promise<{
        totalMessages: number;
        newMessages: number;
        readMessages: number;
        repliedMessages: number;
        archivedMessages: number;
    }> {
        try {
            const snapshot = await this.collection.get();
            const messages = snapshot.docs.map(doc => doc.data());

            return {
                totalMessages: messages.length,
                newMessages: messages.filter(m => m.status === 'new').length,
                readMessages: messages.filter(m => m.status === 'read').length,
                repliedMessages: messages.filter(m => m.status === 'replied').length,
                archivedMessages: messages.filter(m => m.status === 'archived').length,
            };
        } catch (error) {
            console.error('Error getting message stats:', error);
            throw error;
        }
    }
}