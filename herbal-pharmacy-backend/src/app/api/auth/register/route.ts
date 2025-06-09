import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { registerSchema } from '@/lib/validation'
import { sendTemplateEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          ...(validatedData.phone ? [{ phone: validatedData.phone }] : [])
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        phone: validatedData.phone,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        password: hashedPassword,
        newsletter: validatedData.subscribeNewsletter ?? true,
        lastLoginAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        lastLoginAt: true
      }
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Send welcome email
    try {
      await sendTemplateEmail('welcome', user.email, {
        firstName: validatedData.firstName,
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      user,
      token,
      message: 'Account created successfully'
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}