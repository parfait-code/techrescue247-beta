import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersService } from '@/lib/firebase-services';
import { User } from '@/types/firebase';
import { toast } from 'sonner';

interface UserState {
    users: User[];
    selectedUser: User | null;
    isLoading: boolean;
    error: string | null;
    stats: {
        totalUsers: number;
        adminUsers: number;
        regularUsers: number;
    };
}

const initialState: UserState = {
    users: [],
    selectedUser: null,
    isLoading: false,
    error: null,
    stats: {
        totalUsers: 0,
        adminUsers: 0,
        regularUsers: 0,
    },
};

// Thunk pour récupérer tous les utilisateurs (admin seulement)
export const fetchUsers = createAsyncThunk<User[]>(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const users = await usersService.getAll();
            return users;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors du chargement des utilisateurs');
        }
    }
);

// Thunk pour récupérer un utilisateur par ID
export const fetchUserById = createAsyncThunk<User, string>(
    'users/fetchById',
    async (userId, { rejectWithValue }) => {
        try {
            const user = await usersService.getById(userId);
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors du chargement de l\'utilisateur');
        }
    }
);

// Thunk pour mettre à jour un utilisateur
export const updateUser = createAsyncThunk<
    User,
    {
        id: string;
        data: Partial<{
            name: string;
            phone: string;
            role: 'user' | 'admin';
        }>;
    }
>(
    'users/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            await usersService.update(id, data);

            // Récupérer l'utilisateur mis à jour
            const updatedUser = await usersService.getById(id);
            if (!updatedUser) {
                throw new Error('Utilisateur non trouvé après mise à jour');
            }

            toast.success('Utilisateur mis à jour');
            return updatedUser;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la mise à jour');
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        calculateStats: (state) => {
            state.stats = {
                totalUsers: state.users.length,
                adminUsers: state.users.filter(u => u.role === 'admin').length,
                regularUsers: state.users.filter(u => u.role === 'user').length,
            };
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
                userSlice.caseReducers.calculateStats(state);
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
                state.selectedUser = action.payload;
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
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                if (state.selectedUser?.id === action.payload.id) {
                    state.selectedUser = action.payload;
                }
                userSlice.caseReducers.calculateStats(state);
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });
    },
});

export const { setSelectedUser, clearError, calculateStats } = userSlice.actions;
export default userSlice.reducer;