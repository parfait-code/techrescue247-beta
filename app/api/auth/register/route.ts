import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const { name, email, phone, password } = await request.json()

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { message: 'Cet email est déjà utilisé' },
                { status: 400 }
            )
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            phone,
            password,
        })

        return NextResponse.json({
            message: 'Compte créé avec succès',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        })
    } catch (error) {
        console.error('Register error:', error)
        return NextResponse.json(
            { message: 'Erreur lors de la création du compte' },
            { status: 500 }
        )
    }
}