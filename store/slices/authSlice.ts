// store/slices/authSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    User as FirebaseUser,
    updateProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    phone?: string;
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

interface AuthState {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    token: string | null; // Ajouter le token JWT
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    firebaseUser: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Thunk pour la connexion
export const login = createAsyncThunk<
    { user: User; firebaseUser: FirebaseUser; token: string },
    LoginCredentials
>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            // 1. Connexion Firebase
            const userCredential = await signInWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );

            // 2. Appel API pour obtenir le token JWT
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur de connexion');
            }

            const { token, user } = await response.json();

            // 3. Stocker le token dans localStorage
            localStorage.setItem('authToken', token);

            return {
                user,
                firebaseUser: userCredential.user,
                token,
            };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk pour l'inscription
export const register = createAsyncThunk<
    { user: User; firebaseUser: FirebaseUser; token: string },
    RegisterCredentials
>(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            // 1. Créer l'utilisateur Firebase
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );

            await updateProfile(userCredential.user, {
                displayName: credentials.name,
            });

            // 2. Créer le document Firestore
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

            // 3. Appel API pour obtenir le token JWT
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: credentials.name,
                    email: credentials.email,
                    phone: credentials.phone,
                    password: credentials.password,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de l\'inscription');
            }

            const { token } = await response.json();

            // 4. Stocker le token
            localStorage.setItem('authToken', token);

            return {
                user: userData,
                firebaseUser: userCredential.user,
                token,
            };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk pour vérifier l'authentification au démarrage
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch('/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                localStorage.removeItem('authToken');
                throw new Error('Token invalid');
            }

            const { user } = await response.json();
            const firebaseUser = auth.currentUser;

            return {
                user,
                firebaseUser,
                token,
            };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.firebaseUser = action.payload.firebaseUser;
            state.token = action.payload.token || state.token;
            state.isAuthenticated = !!action.payload.user;
        },
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.firebaseUser = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('authToken');
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.firebaseUser = action.payload.firebaseUser;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                toast.success('Connexion réussie');
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error(action.payload as string);
            })
            // Register
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.firebaseUser = action.payload.firebaseUser;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                toast.success('Inscription réussie');
            })
            // Check Auth
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.firebaseUser = action.payload.firebaseUser;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.user = null;
                state.firebaseUser = null;
                state.token = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setUser, clearError, logout } = authSlice.actions;
export default authSlice.reducer;