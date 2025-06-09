import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { calculateShipping } from '@/lib/shipping'
import { shippingCalculationSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request)
    
    const body = await request.json()
    const validatedData = shippingCalculationSchema.parse(body)

    const calculation = await calculateShipping(
      validatedData.addressId,
      validatedData.items,
      validatedData.method
    )

    return NextResponse.json(calculation)

  } catch (error) {
    console.error('Shipping calculation error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to calculate shipping' },
      { status: 500 }
    )
  }
}