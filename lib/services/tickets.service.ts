import { adminDb, COLLECTIONS, serverTimestamp } from '@/lib/firebase-admin';
import { UsersService } from './users.service';

export interface Ticket {
    id?: string;
    userId: string;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    phone: string;
    screenshots?: string[];
    createdAt?: string;
    updatedAt?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
}

export class TicketsService {
    private static collection = adminDb.collection(COLLECTIONS.TICKETS);

    // Créer un ticket
    static async create(ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
        try {
            const ticketDoc = {
                ...ticketData,
                status: ticketData.status || 'open',
                priority: ticketData.priority || 'medium',
                screenshots: ticketData.screenshots || [],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const docRef = await this.collection.add(ticketDoc);

            return {
                id: docRef.id,
                ...ticketDoc,
            };
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }
    }

    // Obtenir un ticket par ID
    static async findById(id: string): Promise<Ticket | null> {
        try {
            const doc = await this.collection.doc(id).get();

            if (!doc.exists) {
                return null;
            }

            const ticketData = doc.data() as Ticket;

            // Récupérer les informations de l'utilisateur
            const user = await UsersService.findById(ticketData.userId);

            return {
                id: doc.id,
                ...ticketData,
                user: user ? {
                    id: user.id!,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                } : undefined,
            };
        } catch (error) {
            console.error('Error finding ticket:', error);
            throw error;
        }
    }

    // Obtenir tous les tickets
    static async findAll(): Promise<Ticket[]> {
        try {
            const snapshot = await this.collection
                .orderBy('createdAt', 'desc')
                .get();

            // Récupérer tous les utilisateurs uniques
            const userIds = [...new Set(snapshot.docs.map(doc => doc.data().userId))];
            const users = await Promise.all(userIds.map(id => UsersService.findById(id)));
            const usersMap = new Map(users.filter(u => u).map(u => [u!.id, u]));

            return snapshot.docs.map(doc => {
                const data = doc.data() as Ticket;
                const user = usersMap.get(data.userId);

                return {
                    id: doc.id,
                    ...data,
                    user: user ? {
                        id: user.id!,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                    } : undefined,
                };
            });
        } catch (error) {
            console.error('Error fetching tickets:', error);
            throw error;
        }
    }

    // Obtenir les tickets d'un utilisateur
    static async findByUserId(userId: string): Promise<Ticket[]> {
        try {
            const snapshot = await this.collection
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as Ticket));
        } catch (error) {
            console.error('Error fetching user tickets:', error);
            throw error;
        }
    }

    // Mettre à jour un ticket
    static async update(id: string, data: Partial<Ticket>): Promise<Ticket | null> {
        try {
            const { user, ...updateData } = data;

            await this.collection.doc(id).update({
                ...updateData,
                updatedAt: serverTimestamp(),
            });

            return this.findById(id);
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw error;
        }
    }

    // Supprimer un ticket
    static async delete(id: string): Promise<boolean> {
        try {
            await this.collection.doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting ticket:', error);
            throw error;
        }
    }

    // Obtenir les statistiques des tickets
    static async getStats(): Promise<{
        totalTickets: number;
        openTickets: number;
        inProgressTickets: number;
        resolvedTickets: number;
    }> {
        try {
            const snapshot = await this.collection.get();
            const tickets = snapshot.docs.map(doc => doc.data());

            return {
                totalTickets: tickets.length,
                openTickets: tickets.filter(t => t.status === 'open').length,
                inProgressTickets: tickets.filter(t => t.status === 'in-progress').length,
                resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
            };
        } catch (error) {
            console.error('Error getting ticket stats:', error);
            throw error;
        }
    }
}