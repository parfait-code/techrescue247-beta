import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
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

        // Only admins can access this route
        if (payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 })
        }

        await dbConnect()

        const users = await User.find({}).select('-password').sort('-createdAt')

        return NextResponse.json(users)
    } catch (error) {
        console.error('Get users error:', error)
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        )
    }
}