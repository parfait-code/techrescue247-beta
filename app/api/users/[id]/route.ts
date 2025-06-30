import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

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
        if (!payload) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        // Only admins or the user themselves can access user details
        if (payload.role !== 'admin' && payload.userId !== params.id) {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 })
        }

        await dbConnect()

        const user = await User.findById(params.id).select('-password')

        if (!user) {
            return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Get user error:', error)
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        )
    }
}

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
        if (!payload) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        // Only admins can update user roles
        if (payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 })
        }

        await dbConnect()

        const data = await request.json()

        // Prevent password updates through this route
        delete data.password

        const user = await User.findByIdAndUpdate(
            await params.id,
            { $set: data },
            { new: true, runValidators: true }
        ).select('-password')

        if (!user) {
            return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Update user error:', error)
        return NextResponse.json(
            { message: 'Erreur lors de la mise à jour' },
            { status: 500 }
        )
    }
}

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
        if (!payload) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
        }

        // Only admins can delete users
        if (payload.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 })
        }

        await dbConnect()

        const user = await User.findByIdAndDelete(params.id)

        if (!user) {
            return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Utilisateur supprimé avec succès' })
    } catch (error) {
        console.error('Delete user error:', error)
        return NextResponse.json(
            { message: 'Erreur lors de la suppression' },
            { status: 500 }
        )
    }
}