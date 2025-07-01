import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { messagesService } from '@/lib/firebase-services';
import { Message } from '@/types/firebase';
import { toast } from 'sonner';

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

// Thunk pour récupérer tous les messages
export const fetchMessages = createAsyncThunk<Message[]>(
    'messages/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const messages = await messagesService.getAll();
            return messages;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors du chargement des messages');
        }
    }
);

// Thunk pour créer un message (depuis le formulaire de contact)
export const createMessage = createAsyncThunk<
    Message,
    {
        name: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
    }
>(
    'messages/create',
    async (data, { rejectWithValue }) => {
        try {
            const messageId = await messagesService.create({
                ...data,
                status: 'new',
            });

            // Récupérer le message créé
            const newMessage = await messagesService.getById(messageId);
            if (!newMessage) {
                throw new Error('Erreur lors de la création du message');
            }

            toast.success('Message envoyé avec succès');
            return newMessage;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de l\'envoi du message');
        }
    }
);

// Thunk pour mettre à jour le statut d'un message
export const updateMessageStatus = createAsyncThunk<
    Message,
    { id: string; status: 'new' | 'read' | 'replied' | 'archived' }
>(
    'messages/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            await messagesService.update(id, { status });

            // Récupérer le message mis à jour
            const updatedMessage = await messagesService.getById(id);
            if (!updatedMessage) {
                throw new Error('Message non trouvé');
            }

            toast.success('Statut mis à jour');
            return updatedMessage;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la mise à jour');
        }
    }
);

// Thunk pour mettre à jour les notes admin
export const updateMessageNotes = createAsyncThunk<
    Message,
    { id: string; adminNotes: string }
>(
    'messages/updateNotes',
    async ({ id, adminNotes }, { rejectWithValue }) => {
        try {
            await messagesService.update(id, { adminNotes });

            // Récupérer le message mis à jour
            const updatedMessage = await messagesService.getById(id);
            if (!updatedMessage) {
                throw new Error('Message non trouvé');
            }

            toast.success('Notes mises à jour');
            return updatedMessage;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la mise à jour');
        }
    }
);

// Thunk pour supprimer un message
export const deleteMessage = createAsyncThunk<string, string>(
    'messages/delete',
    async (messageId, { rejectWithValue }) => {
        try {
            await messagesService.delete(messageId);
            toast.success('Message supprimé');
            return messageId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la suppression');
        }
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
        calculateStats: (state) => {
            state.stats = {
                totalMessages: state.messages.length,
                newMessages: state.messages.filter(m => m.status === 'new').length,
                readMessages: state.messages.filter(m => m.status === 'read').length,
                repliedMessages: state.messages.filter(m => m.status === 'replied').length,
                archivedMessages: state.messages.filter(m => m.status === 'archived').length,
            };
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
                messageSlice.caseReducers.calculateStats(state);
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });

        // Create message
        builder
            .addCase(createMessage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messages.unshift(action.payload);
                messageSlice.caseReducers.calculateStats(state);
            })
            .addCase(createMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });

        // Update message status
        builder
            .addCase(updateMessageStatus.fulfilled, (state, action) => {
                const index = state.messages.findIndex(m => m.id === action.payload.id);
                if (index !== -1) {
                    state.messages[index] = action.payload;
                    if (state.selectedMessage?.id === action.payload.id) {
                        state.selectedMessage = action.payload;
                    }
                }
                messageSlice.caseReducers.calculateStats(state);
            });

        // Update message notes
        builder
            .addCase(updateMessageNotes.fulfilled, (state, action) => {
                const index = state.messages.findIndex(m => m.id === action.payload.id);
                if (index !== -1) {
                    state.messages[index] = action.payload;
                    if (state.selectedMessage?.id === action.payload.id) {
                        state.selectedMessage = action.payload;
                    }
                }
            });

        // Delete message
        builder
            .addCase(deleteMessage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messages = state.messages.filter(m => m.id !== action.payload);
                if (state.selectedMessage?.id === action.payload) {
                    state.selectedMessage = null;
                }
                messageSlice.caseReducers.calculateStats(state);
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });
    },
});

export const { setSelectedMessage, clearError, calculateStats } = messageSlice.actions;
export default messageSlice.reducer;