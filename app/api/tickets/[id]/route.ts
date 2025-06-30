import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Ticket from '@/models/Ticket'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;

    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        await dbConnect()

        const ticket = await Ticket.findById(params.id).populate('userId', 'name email phone')

        if (!ticket) {
            return NextResponse.json({ message: 'Ticket non trouvé' }, { status: 404 })
        }

        // Check if user has access to this ticket
        if (payload.role !== 'admin' && ticket.userId._id.toString() !== payload.userId) {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 })
        }

        return NextResponse.json(ticket)
    } catch (error) {
        console.error('Get ticket error:', error)
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;

    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        // Only admins can update tickets
        if (payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 })
        }

        await dbConnect()

        const data = await request.json()
        const ticket = await Ticket.findByIdAndUpdate(
            params.id,
            { $set: data },
            { new: true, runValidators: true }
        )

        if (!ticket) {
            return NextResponse.json({ message: 'Ticket non trouvé' }, { status: 404 })
        }

        return NextResponse.json(ticket)
    } catch (error) {
        console.error('Update ticket error:', error)
        return NextResponse.json(
            { message: 'Erreur lors de la mise à jour' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;

    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        // Only admins can delete tickets
        if (payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 })
        }

        await dbConnect()

        const ticket = await Ticket.findByIdAndDelete(params.id)

        if (!ticket) {
            return NextResponse.json({ message: 'Ticket non trouvé' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Ticket supprimé avec succès' })
    } catch (error) {
        console.error('Delete ticket error:', error)
        return NextResponse.json(
            { message: 'Erreur lors de la suppression' },
            { status: 500 }
        )
    }
}