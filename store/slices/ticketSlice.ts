import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';

interface Ticket {
    _id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    phone: string;
    screenshots?: string[];
    userId: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface TicketState {
    tickets: Ticket[];
    currentTicket: Ticket | null;
    stats: {
        totalTickets: number;
        openTickets: number;
        inProgressTickets: number;
        resolvedTickets: number;
    };
    isLoading: boolean;
    error: string | null;
}

const initialState: TicketState = {
    tickets: [],
    currentTicket: null,
    stats: {
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0,
        resolvedTickets: 0,
    },
    isLoading: false,
    error: null,
};

// Thunk pour récupérer tous les tickets
export const fetchTickets = createAsyncThunk<Ticket[]>(
    'tickets/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/tickets');

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des tickets');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk pour récupérer un ticket spécifique
export const fetchTicketById = createAsyncThunk<Ticket, string>(
    'tickets/fetchById',
    async (ticketId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/tickets/${ticketId}`);

            if (!response.ok) {
                throw new Error('Ticket non trouvé');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk pour créer un nouveau ticket
export const createTicket = createAsyncThunk<Ticket, {
    title: string;
    description: string;
    priority: string;
    phone: string;
    screenshots?: string[];
}>(
    'tickets/create',
    async (ticketData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la création du ticket');
            }

            const data = await response.json();
            toast.success('Ticket créé avec succès', {
                description: 'Nous vous contacterons bientôt',
            });
            return data;
        } catch (error: any) {
            toast.error('Erreur', {
                description: error.message,
            });
            return rejectWithValue(error.message);
        }
    }
);

// Thunk pour mettre à jour un ticket
export const updateTicket = createAsyncThunk<Ticket, {
    id: string;
    data: Partial<Ticket>;
}>(
    'tickets/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour');
            }

            const updatedTicket = await response.json();
            toast.success('Ticket mis à jour', {
                description: 'Le ticket a été modifié avec succès',
            });
            return updatedTicket;
        } catch (error: any) {
            toast.error('Erreur', {
                description: error.message,
            });
            return rejectWithValue(error.message);
        }
    }
);

const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
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
                // Calculer les statistiques automatiquement
                ticketSlice.caseReducers.calculateStats(state);
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
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
            });
    },
});

export const { clearCurrentTicket, clearError, calculateStats } = ticketSlice.actions;
export default ticketSlice.reducer;