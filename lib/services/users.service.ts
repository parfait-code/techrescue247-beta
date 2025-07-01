import { adminDb, adminAuth, COLLECTIONS, serverTimestamp } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

export interface User {
    id?: string;
    name: string;
    email: string;
    phone: string;
    password?: string;
    role: 'user' | 'admin';
    createdAt?: string;
    updatedAt?: string;
}

export class UsersService {
    private static collection = adminDb.collection(COLLECTIONS.USERS);

    // Créer un utilisateur
    static async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        try {
            // Vérifier si l'utilisateur existe déjà
            const existingUser = await this.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('Cet email est déjà utilisé');
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(userData.password!, 10);

            // Créer l'utilisateur dans Firebase Auth
            const authUser = await adminAuth.createUser({
                email: userData.email,
                password: userData.password,
                displayName: userData.name,
                phoneNumber: userData.phone.startsWith('+') ? userData.phone : `+237${userData.phone}`,
            });

            // Préparer les données pour Firestore
            const userDoc = {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: hashedPassword,
                role: userData.role || 'user',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            // Créer le document dans Firestore avec l'UID de Firebase Auth
            await this.collection.doc(authUser.uid).set(userDoc);

            return {
                id: authUser.uid,
                ...userDoc,
            };
        } catch (error: any) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Trouver un utilisateur par email
    static async findByEmail(email: string): Promise<User | null> {
        try {
            const snapshot = await this.collection
                .where('email', '==', email.toLowerCase())
                .limit(1)
                .get();

            if (snapshot.empty) {
                return null;
            }

            const doc = snapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data(),
            } as User;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    // Trouver un utilisateur par ID
    static async findById(id: string): Promise<User | null> {
        try {
            const doc = await this.collection.doc(id).get();

            if (!doc.exists) {
                return null;
            }

            return {
                id: doc.id,
                ...doc.data(),
            } as User;
        } catch (error) {
            console.error('Error finding user by id:', error);
            throw error;
        }
    }

    // Comparer le mot de passe
    static async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, hashedPassword);
    }

    // Obtenir tous les utilisateurs
    static async findAll(): Promise<User[]> {
        try {
            const snapshot = await this.collection
                .orderBy('createdAt', 'desc')
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as User));
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    // Mettre à jour un utilisateur
    static async update(id: string, data: Partial<User>): Promise<User | null> {
        try {
            // Supprimer le mot de passe des données à mettre à jour
            const { password, ...updateData } = data;

            await this.collection.doc(id).update({
                ...updateData,
                updatedAt: serverTimestamp(),
            });

            return this.findById(id);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Supprimer un utilisateur
    static async delete(id: string): Promise<boolean> {
        try {
            // Supprimer de Firebase Auth
            await adminAuth.deleteUser(id);

            // Supprimer de Firestore
            await this.collection.doc(id).delete();

            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}