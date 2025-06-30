import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser,
    updateProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    phone?: string;
}

interface AuthState {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterCredentials {
    name: string;
    email: string;
    phone: string;
    password: string;
}

const initialState: AuthState = {
    user: null,
    firebaseUser: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Helper pour obtenir les données utilisateur depuis Firestore
const getUserData = async (uid: string): Promise<User | null> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            return {
                id: uid,
                name: data.name,
                email: data.email,
                role: data.role || 'user',
                phone: data.phone,
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
};

// Thunk pour la connexion
export const login = createAsyncThunk<
    { user: User; firebaseUser: FirebaseUser },
    LoginCredentials
>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );

            const userData = await getUserData(userCredential.user.uid);

            if (!userData) {
                throw new Error('Données utilisateur introuvables');
            }

            return {
                user: userData,
                firebaseUser: userCredential.user,
            };
        } catch (error: any) {
            let message = 'Erreur de connexion';

            // Gestion des erreurs Firebase
            switch (error.code) {
                case 'auth/user-not-found':
                    message = 'Aucun utilisateur trouvé avec cet email';
                    break;
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    message = 'Email ou mot de passe incorrect';
                    break;
                case 'auth/too-many-requests':
                    message = 'Trop de tentatives. Veuillez réessayer plus tard';
                    break;
                case 'auth/network-request-failed':
                    message = 'Erreur de connexion réseau';
                    break;
                default:
                    message = error.message || 'Erreur de connexion';
            }

            return rejectWithValue(message);
        }
    }
);

// Thunk pour l'inscription
export const register = createAsyncThunk<
    { user: User; firebaseUser: FirebaseUser },
    RegisterCredentials
>(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            // Créer l'utilisateur Firebase
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );

            // Mettre à jour le profil Firebase
            await updateProfile(userCredential.user, {
                displayName: credentials.name,
            });

            // Créer le document utilisateur dans Firestore
            const userData: User = {
                id: userCredential.user.uid,
                name: credentials.name,
                email: credentials.email,
                phone: credentials.phone,
                role: 'user',
            };

            await setDoc(doc(db, 'users', userCredential.user.uid), {
                ...userData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            return {
                user: userData,
                firebaseUser: userCredential.user,
            };
        } catch (error: any) {
            let message = 'Erreur lors de l\'inscription';

            // Gestion des erreurs Firebase
            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'Cet email est déjà utilisé';
                    break;
                case 'auth/weak-password':
                    message = 'Le mot de passe doit contenir au moins 6 caractères';
                    break;
                case 'auth/invalid-email':
                    message = 'Email invalide';
                    break;
                default:
                    message = error.message || 'Erreur lors de l\'inscription';
            }

            return rejectWithValue(message);
        }
    }
);

// Thunk pour vérifier l'authentification
export const checkAuth = createAsyncThunk<
    { user: User; firebaseUser: FirebaseUser } | null
>(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            return new Promise((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                    unsubscribe();

                    if (firebaseUser) {
                        const userData = await getUserData(firebaseUser.uid);
                        if (userData) {
                            resolve({ user: userData, firebaseUser });
                        } else {
                            resolve(null);
                        }
                    } else {
                        resolve(null);
                    }
                }, reject);
            });
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk pour la déconnexion
export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await signOut(auth);
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<{ user: User; firebaseUser: FirebaseUser }>) => {
            state.user = action.payload.user;
            state.firebaseUser = action.payload.firebaseUser;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.firebaseUser = action.payload.firebaseUser;
                state.error = null;
                toast.success('Connexion réussie');
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            });

        // Register
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.firebaseUser = action.payload.firebaseUser;
                state.error = null;
                toast.success('Compte créé avec succès');
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            });

        // Check Auth
        builder
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.isAuthenticated = true;
                    state.user = action.payload.user;
                    state.firebaseUser = action.payload.firebaseUser;
                } else {
                    state.isAuthenticated = false;
                    state.user = null;
                    state.firebaseUser = null;
                }
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.firebaseUser = null;
            });

        // Logout
        builder
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.firebaseUser = null;
                state.isAuthenticated = false;
                state.error = null;
                state.isLoading = false;
                toast.success('Déconnexion réussie');
            })
            .addCase(logout.rejected, (state) => {
                state.isLoading = false;
                toast.error('Erreur lors de la déconnexion');
            });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;