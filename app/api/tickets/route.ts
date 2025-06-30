import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Ticket from '@/models/Ticket'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
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

        let tickets
        if (payload.role === 'admin') {
            tickets = await Ticket.find({}).populate('userId', 'name email phone').sort('-createdAt')
        } else {
            tickets = await Ticket.find({ userId: payload.userId }).sort('-createdAt')
        }

        return NextResponse.json(tickets)
    } catch (error) {
        console.error('Get tickets error:', error)
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
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

        const data = await request.json()
        const ticket = await Ticket.create({
            ...data,
            userId: payload.userId,
        })

        return NextResponse.json(ticket)
    } catch (error) {
        console.error('Create ticket error:', error)
        return NextResponse.json(
            { message: 'Erreur lors de la création du ticket' },
            { status: 500 }
        )
    }
}