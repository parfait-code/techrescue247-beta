import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAuthToken } from '@/lib/auth-client';

interface Message {
    _id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    repliedAt?: Date;
    adminNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface MessageState {
    messages: Message[];
    selectedMessage: Message | null;
    isLoading: boolean;
    error: string | null;
    stats: {
        totalMessages: number;
        newMessages: number;
        readMessages: number;
        repliedMessages: number;
        archivedMessages: number;
    };
}

const initialState: MessageState = {
    messages: [],
    selectedMessage: null,
    isLoading: false,
    error: null,
    stats: {
        totalMessages: 0,
        newMessages: 0,
        readMessages: 0,
        repliedMessages: 0,
        archivedMessages: 0,
    },
};

// Fetch all messages
export const fetchMessages = createAsyncThunk(
    'messages/fetchAll',
    async () => {
        const token = getAuthToken();
        const response = await fetch('/api/messages', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des messages');
        }

        return response.json();
    }
);

// Update message status
export const updateMessageStatus = createAsyncThunk(
    'messages/updateStatus',
    async ({ id, status }: { id: string; status: Message['status'] }) => {
        const token = getAuthToken();
        const response = await fetch(`/api/messages/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du statut');
        }

        return response.json();
    }
);

// Update message notes
export const updateMessageNotes = createAsyncThunk(
    'messages/updateNotes',
    async ({ id, adminNotes }: { id: string; adminNotes: string }) => {
        const token = getAuthToken();
        const response = await fetch(`/api/messages/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ adminNotes }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour des notes');
        }

        return response.json();
    }
);

// Delete message
export const deleteMessage = createAsyncThunk(
    'messages/delete',
    async (id: string) => {
        const token = getAuthToken();
        const response = await fetch(`/api/messages/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du message');
        }

        return id;
    }
);

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setSelectedMessage: (state, action: PayloadAction<Message | null>) => {
            state.selectedMessage = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch messages
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messages = action.payload;

                // Calculate stats
                state.stats = {
                    totalMessages: action.payload.length,
                    newMessages: action.payload.filter((m: Message) => m.status === 'new').length,
                    readMessages: action.payload.filter((m: Message) => m.status === 'read').length,
                    repliedMessages: action.payload.filter((m: Message) => m.status === 'replied').length,
                    archivedMessages: action.payload.filter((m: Message) => m.status === 'archived').length,
                };
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Erreur inconnue';
            });

        // Update message status
        builder
            .addCase(updateMessageStatus.fulfilled, (state, action) => {
                const index = state.messages.findIndex(m => m._id === action.payload._id);
                if (index !== -1) {
                    state.messages[index] = action.payload;
                    if (state.selectedMessage?._id === action.payload._id) {
                        state.selectedMessage = action.payload;
                    }
                }

                // Recalculate stats
                state.stats = {
                    totalMessages: state.messages.length,
                    newMessages: state.messages.filter(m => m.status === 'new').length,
                    readMessages: state.messages.filter(m => m.status === 'read').length,
                    repliedMessages: state.messages.filter(m => m.status === 'replied').length,
                    archivedMessages: state.messages.filter(m => m.status === 'archived').length,
                };
            });

        // Update message notes
        builder
            .addCase(updateMessageNotes.fulfilled, (state, action) => {
                const index = state.messages.findIndex(m => m._id === action.payload._id);
                if (index !== -1) {
                    state.messages[index] = action.payload;
                    if (state.selectedMessage?._id === action.payload._id) {
                        state.selectedMessage = action.payload;
                    }
                }
            });

        // Delete message
        builder
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.messages = state.messages.filter(m => m._id !== action.payload);
                if (state.selectedMessage?._id === action.payload) {
                    state.selectedMessage = null;
                }

                // Recalculate stats
                state.stats = {
                    totalMessages: state.messages.length,
                    newMessages: state.messages.filter(m => m.status === 'new').length,
                    readMessages: state.messages.filter(m => m.status === 'read').length,
                    repliedMessages: state.messages.filter(m => m.status === 'replied').length,
                    archivedMessages: state.messages.filter(m => m.status === 'archived').length,
                };
            });
    },
});

export const { setSelectedMessage, clearError } = messageSlice.actions;
export default messageSlice.reducer;