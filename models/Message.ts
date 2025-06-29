import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom est requis'],
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        lowercase: true,
    },
    phone: {
        type: String,
        required: [true, 'Le numéro de téléphone est requis'],
    },
    subject: {
        type: String,
        required: [true, 'Le sujet est requis'],
    },
    message: {
        type: String,
        required: [true, 'Le message est requis'],
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'archived'],
        default: 'new',
    },
    repliedAt: {
        type: Date,
    },
    adminNotes: {
        type: String,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);