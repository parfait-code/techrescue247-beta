import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Message from '@/models/Message'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

// GET - Récupérer un message spécifique (Admin uniquement)
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 })
        }

        await dbConnect()

        const message = await Message.findById(params.id)
        if (!message) {
            return NextResponse.json({ message: 'Message non trouvé' }, { status: 404 })
        }

        return NextResponse.json(message)
    } catch (error) {
        console.error('Get message error:', error)
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        )
    }
}

// PATCH - Mettre à jour un message (Admin uniquement)
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 })
        }

        await dbConnect()

        const data = await request.json()

        // Si le statut passe à "replied", ajouter la date de réponse
        if (data.status === 'replied' && !data.repliedAt) {
            data.repliedAt = new Date()
        }

        const message = await Message.findByIdAndUpdate(
            params.id,
            data,
            { new: true, runValidators: true }
        )

        if (!message) {
            return NextResponse.json({ message: 'Message non trouvé' }, { status: 404 })
        }

        return NextResponse.json(message)
    } catch (error) {
        console.error('Update message error:', error)
        return NextResponse.json(
            { message: 'Erreur lors de la mise à jour' },
            { status: 500 }
        )
    }
}

// DELETE - Supprimer un message (Admin uniquement)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 })
        }

        await dbConnect()

        const message = await Message.findByIdAndDelete(params.id)
        if (!message) {
            return NextResponse.json({ message: 'Message non trouvé' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Message supprimé avec succès' })
    } catch (error) {
        console.error('Delete message error:', error)
        return NextResponse.json(
            { message: 'Erreur lors de la suppression' },
            { status: 500 }
        )
    }
}