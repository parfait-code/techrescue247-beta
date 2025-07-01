import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketsService } from '@/lib/firebase-services';
import { Ticket } from '@/types/firebase';
import { toast } from 'sonner';

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

// Thunk pour récupérer tous les tickets
export const fetchTickets = createAsyncThunk<
    Ticket[],
    { userId?: string; isAdmin?: boolean } | undefined
>(
    'tickets/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            // Si c'est un utilisateur normal, filtrer par userId
            const filters = params?.isAdmin ? {} : { userId: params?.userId };
            const tickets = await ticketsService.getAll(filters);
            return tickets;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors du chargement des tickets');
        }
    }
);

// Thunk pour récupérer un ticket par ID
export const fetchTicketById = createAsyncThunk<Ticket, string>(
    'tickets/fetchById',
    async (ticketId, { rejectWithValue }) => {
        try {
            const ticket = await ticketsService.getById(ticketId);
            if (!ticket) {
                throw new Error('Ticket non trouvé');
            }
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
        userId: string;
        title: string;
        description: string;
        priority: 'low' | 'medium' | 'high' | 'urgent';
        phone: string;
        screenshots?: string[];
    }
>(
    'tickets/create',
    async (data, { rejectWithValue }) => {
        try {
            const ticketId = await ticketsService.create({
                ...data,
                status: 'open',
                screenshots: data.screenshots || [],
            });

            // Récupérer le ticket créé avec les infos utilisateur
            const newTicket = await ticketsService.getById(ticketId);
            if (!newTicket) {
                throw new Error('Erreur lors de la création du ticket');
            }

            toast.success('Ticket créé avec succès');
            return newTicket;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la création du ticket');
        }
    }
);

// Thunk pour mettre à jour un ticket
export const updateTicket = createAsyncThunk<
    Ticket,
    {
        id: string;
        data: Partial<{
            title: string;
            description: string;
            status: 'open' | 'in-progress' | 'resolved' | 'closed';
            priority: 'low' | 'medium' | 'high' | 'urgent';
        }>;
    }
>(
    'tickets/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            await ticketsService.update(id, data);

            // Récupérer le ticket mis à jour
            const updatedTicket = await ticketsService.getById(id);
            if (!updatedTicket) {
                throw new Error('Ticket non trouvé après mise à jour');
            }

            toast.success('Ticket mis à jour avec succès');
            return updatedTicket;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la mise à jour du ticket');
        }
    }
);

// Thunk pour supprimer un ticket
export const deleteTicket = createAsyncThunk<string, string>(
    'tickets/delete',
    async (ticketId, { rejectWithValue }) => {
        try {
            await ticketsService.delete(ticketId);
            toast.success('Ticket supprimé avec succès');
            return ticketId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la suppression du ticket');
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
                const index = state.tickets.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                }
                if (state.currentTicket?.id === action.payload.id) {
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
                state.tickets = state.tickets.filter(t => t.id !== action.payload);
                if (state.currentTicket?.id === action.payload) {
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

export const { clearCurrentTicket, clearError, calculateStats } = ticketSlice.actions;
export default ticketSlice.reducer;