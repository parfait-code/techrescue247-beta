import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  QueryConstraint,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  FirestoreUser,
  FirestoreTicket,
  FirestoreMessage,
  User,
  Ticket,
  Message,
  timestampToDate,
} from '@/types/firebase';

// ========== USERS SERVICE ==========
export const usersService = {
  // Obtenir un utilisateur par ID
  async getById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return null;

      const data = userDoc.data() as FirestoreUser;
      return {
        id: userDoc.id,
        ...data,
        createdAt: timestampToDate(data.createdAt as any),
        updatedAt: timestampToDate(data.updatedAt as any),
      };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Obtenir tous les utilisateurs (admin)
  async getAll(): Promise<User[]> {
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data() as FirestoreUser;
        return {
          id: doc.id,
          ...data,
          createdAt: timestampToDate(data.createdAt as any),
          updatedAt: timestampToDate(data.updatedAt as any),
        };
      });
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  // Mettre à jour un utilisateur
  async update(userId: string, data: Partial<FirestoreUser>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};

// ========== TICKETS SERVICE ==========
export const ticketsService = {
  // Créer un ticket
  async create(data: Omit<FirestoreTicket, 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'tickets'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  // Obtenir tous les tickets (avec filtres optionnels)
  async getAll(filters?: {
    userId?: string;
    status?: string;
    priority?: string;
  }): Promise<Ticket[]> {
    try {
      const constraints: QueryConstraint[] = [
        orderBy('createdAt', 'desc')
      ];

      if (filters?.userId) {
        constraints.push(where('userId', '==', filters.userId));
      }
      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }
      if (filters?.priority) {
        constraints.push(where('priority', '==', filters.priority));
      }

      const q = query(collection(db, 'tickets'), ...constraints);
      const snapshot = await getDocs(q);

      // Récupérer les données des utilisateurs associés
      const tickets: Ticket[] = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as FirestoreTicket;

        // Récupérer l'utilisateur associé
        let user: User | undefined;
        if (data.userId) {
          const userData = await usersService.getById(data.userId);
          if (userData) {
            user = userData;
          }
        }

        tickets.push({
          id: docSnap.id,
          ...data,
          user,
          createdAt: timestampToDate(data.createdAt as any)!,
          updatedAt: timestampToDate(data.updatedAt as any)!,
        });
      }

      return tickets;
    } catch (error) {
      console.error('Error getting tickets:', error);
      throw error;
    }
  },

  // Obtenir un ticket par ID
  async getById(ticketId: string): Promise<Ticket | null> {
    try {
      const ticketDoc = await getDoc(doc(db, 'tickets', ticketId));
      if (!ticketDoc.exists()) return null;

      const data = ticketDoc.data() as FirestoreTicket;

      // Récupérer l'utilisateur associé
      let user: User | undefined;
      if (data.userId) {
        const userData = await usersService.getById(data.userId);
        if (userData) {
          user = userData;
        }
      }

      return {
        id: ticketDoc.id,
        ...data,
        user,
        createdAt: timestampToDate(data.createdAt as any)!,
        updatedAt: timestampToDate(data.updatedAt as any)!,
      };
    } catch (error) {
      console.error('Error getting ticket:', error);
      throw error;
    }
  },

  // Mettre à jour un ticket
  async update(ticketId: string, data: Partial<FirestoreTicket>): Promise<void> {
    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  // Supprimer un ticket
  async delete(ticketId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tickets', ticketId));
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  },
};

// ========== MESSAGES SERVICE ==========
export const messagesService = {
  // Créer un message
  async create(data: Omit<FirestoreMessage, 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  // Obtenir tous les messages
  async getAll(filters?: {
    status?: string;
  }): Promise<Message[]> {
    try {
      const constraints: QueryConstraint[] = [
        orderBy('createdAt', 'desc')
      ];

      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      const q = query(collection(db, 'messages'), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data() as FirestoreMessage;
        return {
          id: doc.id,
          ...data,
          createdAt: timestampToDate(data.createdAt as any)!,
          updatedAt: timestampToDate(data.updatedAt as any)!,
          repliedAt: timestampToDate(data.repliedAt as any),
        };
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  // Obtenir un message par ID
  async getById(messageId: string): Promise<Message | null> {
    try {
      const messageDoc = await getDoc(doc(db, 'messages', messageId));
      if (!messageDoc.exists()) return null;

      const data = messageDoc.data() as FirestoreMessage;
      return {
        id: messageDoc.id,
        ...data,
        createdAt: timestampToDate(data.createdAt as any)!,
        updatedAt: timestampToDate(data.updatedAt as any)!,
        repliedAt: timestampToDate(data.repliedAt as any),
      };
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  },

  // Mettre à jour un message
  async update(messageId: string, data: Partial<FirestoreMessage>): Promise<void> {
    try {
      const updateData: any = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      // Si le statut passe à "replied", ajouter la date de réponse
      if (data.status === 'replied' && !data.repliedAt) {
        updateData.repliedAt = serverTimestamp();
      }

      await updateDoc(doc(db, 'messages', messageId), updateData);
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  },

  // Supprimer un message
  async delete(messageId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'messages', messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },
};

// ========== BATCH OPERATIONS ==========
export const batchOperations = {
  // Créer plusieurs documents en batch
  async createMany<T extends { [key: string]: any }>(
    collectionName: string,
    documents: T[]
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      documents.forEach(doc => {
        const docRef = doc.id
          ? doc(db, collectionName, doc.id)
          : doc(collection(db, collectionName));
        batch.set(docRef, {
          ...doc,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error in batch create:', error);
      throw error;
    }
  },
};