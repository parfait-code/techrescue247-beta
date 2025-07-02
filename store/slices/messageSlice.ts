// store/slices/messageSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';

interface Message {
    _id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    createdAt: string;
    updatedAt: string;
    repliedAt?: string;
    adminNotes?: string;
}

interface MessageState {
    messages: Message[];
    currentMessage: Message | null;
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
    currentMessage: null,
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

// Thunk pour récupérer tous les messages (admin)
export const fetchMessages = createAsyncThunk(
    'messages/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/messages', {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors du chargement des messages');
            }

            const messages = await response.json();
            return messages;
        } catch (error: any) {
            console.error('Erreur fetchMessages:', error);
            return rejectWithValue(error.message || 'Erreur lors du chargement des messages');
        }
    }
);

// Thunk pour récupérer un message par ID
export const fetchMessageById = createAsyncThunk<Message, string>(
    'messages/fetchById',
    async (messageId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/messages/${messageId}`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Message non trouvé');
            }

            const message = await response.json();
            return message;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors du chargement du message');
        }
    }
);

// Thunk pour créer un message (public - formulaire de contact)
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
    async (messageData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de l\'envoi du message');
            }

            const message = await response.json();
            toast.success('Message envoyé avec succès');
            return message;
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
            const response = await fetch(`/api/messages/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la mise à jour du statut');
            }

            const message = await response.json();
            toast.success('Statut mis à jour');
            return message;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la mise à jour du statut');
        }
    }
);

// Thunk pour mettre à jour les notes admin d'un message
export const updateMessageNotes = createAsyncThunk<
    Message,
    { id: string; adminNotes: string }
>(
    'messages/updateNotes',
    async ({ id, adminNotes }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/messages/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ adminNotes }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la mise à jour des notes');
            }

            const message = await response.json();
            toast.success('Notes mises à jour');
            return message;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la mise à jour des notes');
        }
    }
);

// Thunk pour mettre à jour un message
export const updateMessage = createAsyncThunk<
    Message,
    { id: string; data: Partial<Message> }
>(
    'messages/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/messages/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la mise à jour');
            }

            const message = await response.json();
            toast.success('Message mis à jour');
            return message;
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
            const response = await fetch(`/api/messages/${messageId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la suppression');
            }

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
        setCurrentMessage: (state, action) => {
            state.currentMessage = action.payload;
        },
        clearCurrentMessage: (state) => {
            state.currentMessage = null;
        },
        setSelectedMessage: (state, action) => {
            state.selectedMessage = action.payload;
        },
        clearSelectedMessage: (state) => {
            state.selectedMessage = null;
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
        // Fetch all messages
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

        // Fetch message by ID
        builder
            .addCase(fetchMessageById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMessageById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentMessage = action.payload;
                // Optionnel : mettre à jour selectedMessage aussi
                state.selectedMessage = action.payload;
            })
            .addCase(fetchMessageById.rejected, (state, action) => {
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
                // Ne pas ajouter aux messages car c'est public
            })
            .addCase(createMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });

        // Update message
        builder
            .addCase(updateMessage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.messages.findIndex(m => m._id === action.payload._id);
                if (index !== -1) {
                    state.messages[index] = action.payload;
                }
                if (state.currentMessage?._id === action.payload._id) {
                    state.currentMessage = action.payload;
                }
                if (state.selectedMessage?._id === action.payload._id) {
                    state.selectedMessage = action.payload;
                }
                messageSlice.caseReducers.calculateStats(state);
            })
            .addCase(updateMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });

        // Update message status
        builder
            .addCase(updateMessageStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateMessageStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.messages.findIndex(m => m._id === action.payload._id);
                if (index !== -1) {
                    state.messages[index] = action.payload;
                }
                if (state.currentMessage?._id === action.payload._id) {
                    state.currentMessage = action.payload;
                }
                if (state.selectedMessage?._id === action.payload._id) {
                    state.selectedMessage = action.payload;
                }
                messageSlice.caseReducers.calculateStats(state);
            })
            .addCase(updateMessageStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });

        // Update message notes
        builder
            .addCase(updateMessageNotes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateMessageNotes.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.messages.findIndex(m => m._id === action.payload._id);
                if (index !== -1) {
                    state.messages[index] = action.payload;
                }
                if (state.currentMessage?._id === action.payload._id) {
                    state.currentMessage = action.payload;
                }
                if (state.selectedMessage?._id === action.payload._id) {
                    state.selectedMessage = action.payload;
                }
            })
            .addCase(updateMessageNotes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });

        // Delete message
        builder
            .addCase(deleteMessage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messages = state.messages.filter(m => m._id !== action.payload);
                if (state.currentMessage?._id === action.payload) {
                    state.currentMessage = null;
                }
                if (state.selectedMessage?._id === action.payload) {
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

export const { setCurrentMessage, clearCurrentMessage, setSelectedMessage, clearSelectedMessage, clearError } = messageSlice.actions;
export default messageSlice.reducer;