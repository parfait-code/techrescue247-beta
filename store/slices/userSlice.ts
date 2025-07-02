// store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    createdAt?: string;
    updatedAt?: string;
}

interface UserState {
    users: User[];
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    currentUser: null,
    isLoading: false,
    error: null,
};

// Helper pour obtenir le token
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Helper pour les headers authentifiés
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

// Thunk pour récupérer tous les utilisateurs (admin)
export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/users', {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors du chargement des utilisateurs');
            }

            const data = await response.json();
            return data.users || data; // Gérer les deux formats de réponse possibles
        } catch (error: any) {
            console.error('Erreur fetchUsers:', error);
            return rejectWithValue(error.message || 'Erreur lors du chargement des utilisateurs');
        }
    }
);

// Thunk pour récupérer un utilisateur par ID
export const fetchUserById = createAsyncThunk<User, string>(
    'users/fetchById',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Utilisateur non trouvé');
            }

            const user = await response.json();
            return user.data || user; // Gérer les deux formats
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors du chargement de l\'utilisateur');
        }
    }
);

// Thunk pour mettre à jour un utilisateur
export const updateUser = createAsyncThunk<
    User,
    { id: string; data: Partial<User> }
>(
    'users/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la mise à jour');
            }

            const user = await response.json();
            toast.success('Utilisateur mis à jour');
            return user.data || user;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la mise à jour');
        }
    }
);

// Thunk pour supprimer un utilisateur
export const deleteUser = createAsyncThunk<string, string>(
    'users/delete',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la suppression');
            }

            toast.success('Utilisateur supprimé');
            return userId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la suppression');
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        clearCurrentUser: (state) => {
            state.currentUser = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch all users
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });

        // Fetch user by ID
        builder
            .addCase(fetchUserById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });

        // Update user
        builder
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                if (state.currentUser?._id === action.payload._id) {
                    state.currentUser = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });

        // Delete user
        builder
            .addCase(deleteUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = state.users.filter(u => u._id !== action.payload);
                if (state.currentUser?._id === action.payload) {
                    state.currentUser = null;
                }
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });
    },
});

export const { setCurrentUser, clearCurrentUser, clearError } = userSlice.actions;
export default userSlice.reducer;