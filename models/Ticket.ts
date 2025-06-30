import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Le titre est requis'],
    },
    description: {
        type: String,
        required: [true, 'La description est requise'],
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
    },
    phone: {
        type: String,
        required: [true, 'Le numéro de téléphone est requis'],
    },
    screenshots: [{
        type: String,
    }],
}, {
    timestamps: true,
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);