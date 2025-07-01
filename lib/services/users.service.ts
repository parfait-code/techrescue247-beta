// lib/services/users.service.ts - Version améliorée

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
    migratedAt?: string;
    migrationNote?: string;
}

export class UsersService {
    private static collection = adminDb.collection(COLLECTIONS.USERS);

    // Créer un utilisateur avec gestion des conflits améliorée
    static async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        try {
            // Validation des données d'entrée
            if (!userData.email || !userData.name || !userData.password) {
                throw new Error('Email, nom et mot de passe sont requis');
            }

            // Normaliser l'email
            const normalizedEmail = userData.email.toLowerCase().trim();

            // Vérifier si l'utilisateur existe déjà dans Firestore
            const existingUser = await this.findByEmail(normalizedEmail);
            if (existingUser) {
                throw new Error('Un utilisateur avec cet email existe déjà dans la base de données');
            }

            // Vérifier si l'utilisateur existe dans Firebase Auth
            let authUser;
            try {
                authUser = await adminAuth.getUserByEmail(normalizedEmail);
                console.log(`Utilisateur trouvé dans Firebase Auth: ${normalizedEmail}`);

                // Si l'utilisateur existe dans Auth mais pas dans Firestore,
                // nous allons utiliser son UID existant
            } catch (authError: any) {
                if (authError.code === 'auth/user-not-found') {
                    // Créer l'utilisateur dans Firebase Auth
                    console.log(`Création d'un nouvel utilisateur Firebase Auth: ${normalizedEmail}`);
                    authUser = await adminAuth.createUser({
                        email: normalizedEmail,
                        password: userData.password,
                        displayName: userData.name,
                        phoneNumber: userData.phone.startsWith('+') ? userData.phone : `+237${userData.phone}`,
                    });
                } else {
                    console.error('Erreur Firebase Auth:', authError);
                    throw authError;
                }
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Préparer les données pour Firestore
            const userDoc = {
                name: userData.name.trim(),
                email: normalizedEmail,
                phone: userData.phone.trim(),
                password: hashedPassword,
                role: userData.role || 'user',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            // Créer ou mettre à jour le document dans Firestore avec l'UID de Firebase Auth
            await this.collection.doc(authUser.uid).set(userDoc);

            console.log(`Utilisateur créé avec succès: ${normalizedEmail} (${authUser.uid})`);

            // Retourner l'utilisateur sans le mot de passe
            const { password: _, ...userWithoutPassword } = userDoc;
            return {
                id: authUser.uid,
                ...userWithoutPassword,
            };
        } catch (error: any) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Trouver un utilisateur par email (AVEC le mot de passe pour l'authentification)
    static async findByEmailWithPassword(email: string): Promise<User | null> {
        try {
            const normalizedEmail = email.toLowerCase().trim();
            const snapshot = await this.collection
                .where('email', '==', normalizedEmail)
                .limit(1)
                .get();

            if (snapshot.empty) {
                console.log(`Aucun utilisateur trouvé pour l'email: ${normalizedEmail}`);
                return null;
            }

            const doc = snapshot.docs[0];
            const userData = doc.data();

            // Vérifier que l'utilisateur a un mot de passe
            if (!userData.password) {
                console.warn(`Utilisateur trouvé mais sans mot de passe: ${normalizedEmail}`);
            }

            return {
                id: doc.id,
                ...userData,
            } as User;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    // Trouver un utilisateur par email (SANS le mot de passe)
    static async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.findByEmailWithPassword(email);
            if (!user) return null;

            // Retourner sans le mot de passe
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword as User;
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

            // Retourner sans le mot de passe
            const userData = doc.data();
            const { password: _, ...userWithoutPassword } = userData || {};
            return {
                id: doc.id,
                ...userWithoutPassword,
            } as User;
        } catch (error) {
            console.error('Error finding user by id:', error);
            throw error;
        }
    }

    // Comparer le mot de passe avec gestion d'erreurs améliorée
    static async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
        // Vérifier que les deux paramètres sont définis
        if (!candidatePassword || !hashedPassword) {
            console.error('Password comparison failed: missing parameters', {
                candidatePassword: !!candidatePassword,
                hashedPassword: !!hashedPassword
            });
            return false;
        }

        try {
            const isMatch = await bcrypt.compare(candidatePassword, hashedPassword);
            console.log(`Password comparison result: ${isMatch}`);
            return isMatch;
        } catch (error) {
            console.error('Error comparing passwords:', error);
            return false;
        }
    }

    // Obtenir tous les utilisateurs
    static async findAll(): Promise<User[]> {
        try {
            const snapshot = await this.collection
                .orderBy('createdAt', 'desc')
                .get();

            return snapshot.docs.map(doc => {
                const userData = doc.data();
                // Retourner sans le mot de passe
                const { password: _, ...userWithoutPassword } = userData;
                return {
                    id: doc.id,
                    ...userWithoutPassword,
                } as User;
            });
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

    // Réinitialiser le mot de passe d'un utilisateur
    static async resetPassword(email: string, newPassword: string): Promise<boolean> {
        try {
            const normalizedEmail = email.toLowerCase().trim();

            // Trouver l'utilisateur
            const user = await this.findByEmailWithPassword(normalizedEmail);
            if (!user || !user.id) {
                throw new Error('Utilisateur non trouvé');
            }

            // Hasher le nouveau mot de passe
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Mettre à jour dans Firestore
            await this.collection.doc(user.id).update({
                password: hashedPassword,
                updatedAt: serverTimestamp(),
                passwordResetAt: serverTimestamp(),
            });

            // Mettre à jour dans Firebase Auth
            await adminAuth.updateUser(user.id, {
                password: newPassword
            });

            console.log(`Mot de passe réinitialisé pour: ${normalizedEmail}`);
            return true;
        } catch (error) {
            console.error('Error resetting password:', error);
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

            console.log(`Utilisateur supprimé: ${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // Vérifier l'intégrité d'un utilisateur
    static async checkUserIntegrity(email: string): Promise<{
        inFirestore: boolean;
        inFirebaseAuth: boolean;
        hasPassword: boolean;
        recommendations: string[];
    }> {
        try {
            const normalizedEmail = email.toLowerCase().trim();
            const recommendations: string[] = [];

            // Vérifier Firestore
            const firestoreUser = await this.findByEmailWithPassword(normalizedEmail);
            const inFirestore = !!firestoreUser;
            const hasPassword = !!(firestoreUser?.password);

            // Vérifier Firebase Auth
            let inFirebaseAuth = false;
            try {
                await adminAuth.getUserByEmail(normalizedEmail);
                inFirebaseAuth = true;
            } catch (error: any) {
                if (error.code !== 'auth/user-not-found') {
                    throw error;
                }
            }

            // Générer des recommandations
            if (!inFirestore && !inFirebaseAuth) {
                recommendations.push('Utilisateur inexistant - peut être créé normalement');
            } else if (inFirestore && !inFirebaseAuth) {
                recommendations.push('Utilisateur en Firestore mais pas dans Auth - créer dans Auth');
            } else if (!inFirestore && inFirebaseAuth) {
                recommendations.push('Utilisateur dans Auth mais pas en Firestore - créer en Firestore');
            } else if (inFirestore && inFirebaseAuth && !hasPassword) {
                recommendations.push('Utilisateur existe mais sans mot de passe - migration nécessaire');
            } else {
                recommendations.push('Utilisateur intègre - aucune action nécessaire');
            }

            return {
                inFirestore,
                inFirebaseAuth,
                hasPassword,
                recommendations
            };
        } catch (error) {
            console.error('Error checking user integrity:', error);
            throw error;
        }
    }
}