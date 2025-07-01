// lib/services/messages.service.ts
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
    // Nouvelles métadonnées optionnelles
    metadata?: {
        ip?: string;
        userAgent?: string;
        referrer?: string;
    };
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
                // Ajouter les métadonnées si fournies
                metadata: messageData.metadata || {},
            };

            const docRef = await this.collection.add(messageDoc);

            // Log pour monitoring (optionnel)
            console.log(`New message created: ${docRef.id} from ${messageData.email}`);

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

    // Obtenir tous les messages avec filtres optionnels
    static async findAll(filters?: {
        status?: Message['status'];
        startDate?: Date;
        endDate?: Date;
        search?: string;
    }): Promise<Message[]> {
        try {
            let query = this.collection.orderBy('createdAt', 'desc');

            // Appliquer les filtres si fournis
            if (filters?.status) {
                query = query.where('status', '==', filters.status);
            }

            if (filters?.startDate) {
                query = query.where('createdAt', '>=', filters.startDate);
            }

            if (filters?.endDate) {
                query = query.where('createdAt', '<=', filters.endDate);
            }

            const snapshot = await query.get();

            let messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as Message));

            // Filtrer par recherche si nécessaire
            if (filters?.search) {
                const searchLower = filters.search.toLowerCase();
                messages = messages.filter(msg =>
                    msg.name.toLowerCase().includes(searchLower) ||
                    msg.email.toLowerCase().includes(searchLower) ||
                    msg.subject.toLowerCase().includes(searchLower) ||
                    msg.message.toLowerCase().includes(searchLower)
                );
            }

            return messages;
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
            console.log(`Message deleted: ${id}`);
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
        todayMessages: number;
        weekMessages: number;
    }> {
        try {
            const snapshot = await this.collection.get();
            const messages = snapshot.docs.map(doc => doc.data());

            // Dates pour les statistiques
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            return {
                totalMessages: messages.length,
                newMessages: messages.filter(m => m.status === 'new').length,
                readMessages: messages.filter(m => m.status === 'read').length,
                repliedMessages: messages.filter(m => m.status === 'replied').length,
                archivedMessages: messages.filter(m => m.status === 'archived').length,
                todayMessages: messages.filter(m => {
                    const createdAt = m.createdAt?.toDate?.() || new Date(m.createdAt);
                    return createdAt >= today;
                }).length,
                weekMessages: messages.filter(m => {
                    const createdAt = m.createdAt?.toDate?.() || new Date(m.createdAt);
                    return createdAt >= weekAgo;
                }).length,
            };
        } catch (error) {
            console.error('Error getting message stats:', error);
            throw error;
        }
    }

    // Marquer plusieurs messages comme lus
    static async markAsRead(ids: string[]): Promise<void> {
        try {
            const batch = adminDb.batch();

            ids.forEach(id => {
                const docRef = this.collection.doc(id);
                batch.update(docRef, {
                    status: 'read',
                    updatedAt: serverTimestamp(),
                });
            });

            await batch.commit();
            console.log(`Marked ${ids.length} messages as read`);
        } catch (error) {
            console.error('Error marking messages as read:', error);
            throw error;
        }
    }
}