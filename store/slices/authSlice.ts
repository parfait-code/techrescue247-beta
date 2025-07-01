// store/slices/authSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User as FirebaseUser } from 'firebase/auth';
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
    token: string | null;
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

// Thunk pour la connexion - UNIQUEMENT via l'API
export const login = createAsyncThunk<
    { user: User; token: string },
    LoginCredentials
>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur de connexion');
            }

            const { token, user } = await response.json();

            // Stocker le token dans localStorage
            localStorage.setItem('authToken', token);

            return { user, token };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk pour l'inscription - UNIQUEMENT via l'API
export const register = createAsyncThunk<
    { user: User; token: string },
    RegisterCredentials
>(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de l\'inscription');
            }

            const { token, user } = await response.json();

            // Stocker le token
            localStorage.setItem('authToken', token);

            return { user, token };
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

            return { user, token };
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
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                toast.success('Inscription réussie');
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error(action.payload as string);
            })
            // Check Auth
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload.user;
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