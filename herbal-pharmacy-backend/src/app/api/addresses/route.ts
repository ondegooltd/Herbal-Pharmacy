import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { addressSchema } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(addresses)

  } catch (error) {
    console.error('Addresses fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    
    const validatedData = addressSchema.parse(body)

    // If this is set as default, unset other default addresses
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: user.id,
          isDefault: true 
        },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.create({
      data: {
        ...validatedData,
        userId: user.id
      }
    })

    return NextResponse.json(address, { status: 201 })

  } catch (error) {
    console.error('Address creation error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    )
  }
}