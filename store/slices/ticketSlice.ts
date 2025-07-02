// store/slices/ticketSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';

interface Ticket {
    _id: string;
    userId: string;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    phone: string;
    screenshots: string[];
    createdAt: string;
    updatedAt: string;
    user?: {
        name: string;
        email: string;
        phone: string;
    };
}

interface TicketState {
    tickets: Ticket[];
    currentTicket: Ticket | null;
    isLoading: boolean;
    error: string | null;
    stats: {
        totalTickets: number;
        openTickets: number;
        inProgressTickets: number;
        resolvedTickets: number;
    };
}

const initialState: TicketState = {
    tickets: [],
    currentTicket: null,
    isLoading: false,
    error: null,
    stats: {
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0,
        resolvedTickets: 0,
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

// Thunk pour récupérer tous les tickets via l'API
export const fetchTickets = createAsyncThunk(
    'tickets/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/tickets', {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors du chargement des tickets');
            }

            const tickets = await response.json();
            return tickets;
        } catch (error: any) {
            console.error('Erreur fetchTickets:', error);
            return rejectWithValue(error.message || 'Erreur lors du chargement des tickets');
        }
    }
);

// Thunk pour récupérer un ticket par ID
export const fetchTicketById = createAsyncThunk<Ticket, string>(
    'tickets/fetchById',
    async (ticketId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/tickets/${ticketId}`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Ticket non trouvé');
            }

            const ticket = await response.json();
            return ticket;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors du chargement du ticket');
        }
    }
);

// Thunk pour créer un ticket
export const createTicket = createAsyncThunk<
    Ticket,
    {
        title: string;
        description: string;
        priority: 'low' | 'medium' | 'high' | 'urgent';
        phone: string;
        screenshots?: string[];
    }
>(
    'tickets/create',
    async (ticketData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(ticketData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la création du ticket');
            }

            const ticket = await response.json();
            toast.success('Ticket créé avec succès');
            return ticket;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la création du ticket');
        }
    }
);

// Thunk pour mettre à jour un ticket
export const updateTicket = createAsyncThunk<
    Ticket,
    { id: string; data: Partial<Ticket> }
>(
    'tickets/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la mise à jour');
            }

            const ticket = await response.json();
            toast.success('Ticket mis à jour');
            return ticket;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la mise à jour');
        }
    }
);

// Thunk pour supprimer un ticket
export const deleteTicket = createAsyncThunk<string, string>(
    'tickets/delete',
    async (ticketId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la suppression');
            }

            toast.success('Ticket supprimé');
            return ticketId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la suppression');
        }
    }
);

const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        setCurrentTicket: (state, action) => {
            state.currentTicket = action.payload;
        },
        clearCurrentTicket: (state) => {
            state.currentTicket = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        calculateStats: (state) => {
            state.stats = {
                totalTickets: state.tickets.length,
                openTickets: state.tickets.filter(t => t.status === 'open').length,
                inProgressTickets: state.tickets.filter(t => t.status === 'in-progress').length,
                resolvedTickets: state.tickets.filter(t => t.status === 'resolved').length,
            };
        },
    },
    extraReducers: (builder) => {
        // Fetch all tickets
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tickets = action.payload;
                ticketSlice.caseReducers.calculateStats(state);
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });

        // Fetch ticket by ID
        builder
            .addCase(fetchTicketById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTicketById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentTicket = action.payload;
            })
            .addCase(fetchTicketById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });

        // Create ticket
        builder
            .addCase(createTicket.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tickets.unshift(action.payload);
                ticketSlice.caseReducers.calculateStats(state);
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });

        // Update ticket
        builder
            .addCase(updateTicket.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.tickets.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                }
                if (state.currentTicket?._id === action.payload._id) {
                    state.currentTicket = action.payload;
                }
                ticketSlice.caseReducers.calculateStats(state);
            })
            .addCase(updateTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });

        // Delete ticket
        builder
            .addCase(deleteTicket.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tickets = state.tickets.filter(t => t._id !== action.payload);
                if (state.currentTicket?._id === action.payload) {
                    state.currentTicket = null;
                }
                ticketSlice.caseReducers.calculateStats(state);
            })
            .addCase(deleteTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                toast.error('Erreur', { description: state.error });
            });
    },
});

export const { setCurrentTicket, clearCurrentTicket, clearError } = ticketSlice.actions;
export default ticketSlice.reducer;