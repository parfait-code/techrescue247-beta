import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'client' | 'admin';
    createdAt: string;
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

// Thunk pour récupérer tous les utilisateurs (admin seulement)
export const fetchUsers = createAsyncThunk<User[]>(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/users');

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des utilisateurs');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk pour récupérer un utilisateur spécifique
export const fetchUserById = createAsyncThunk<User, string>(
    'users/fetchById',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/users/${userId}`);

            if (!response.ok) {
                throw new Error('Utilisateur non trouvé');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk pour mettre à jour un utilisateur
export const updateUser = createAsyncThunk<User, { id: string; data: Partial<User> }>(
    'users/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour');
            }

            const updatedUser = await response.json();
            return updatedUser;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
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
            });

        // Update user
        builder
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                // Mettre à jour l'utilisateur dans la liste
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                // Mettre à jour currentUser si c'est le même
                if (state.currentUser?._id === action.payload._id) {
                    state.currentUser = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentUser, clearError } = userSlice.actions;
export default userSlice.reducer;