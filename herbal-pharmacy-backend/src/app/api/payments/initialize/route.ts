import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { initializePayment } from '@/lib/payment'
import { z } from 'zod'

const initializePaymentSchema = z.object({
  amount: z.number().positive(),
  email: z.string().email(),
  orderId: z.string(),
  metadata: z.record(z.any()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    
    const validatedData = initializePaymentSchema.parse(body)

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: validatedData.orderId,
        userId: user.id
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const result = await initializePayment(
      validatedData.amount,
      validatedData.email,
      validatedData.orderId,
      validatedData.metadata
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Payment initialization error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
} 