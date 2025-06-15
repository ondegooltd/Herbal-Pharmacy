import { prisma } from './prisma'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

if (!PAYSTACK_SECRET_KEY) {
  console.error('Paystack secret key not found in environment variables')
}

export async function initializePayment(
  amount: number,
  email: string,
  orderId: string,
  metadata: Record<string, any> = {}
) {
  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to pesewas
        email,
        currency: 'GHS',
        callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
        metadata: {
          orderId,
          ...metadata
        }
      })
    })

    const data = await response.json()
    
    if (!data.status) {
      throw new Error(data.message || 'Payment initialization failed')
    }

    // Update order with payment reference
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentReference: data.data.reference
      }
    })

    return {
      success: true,
      reference: data.data.reference,
      message: 'Payment initialized successfully'
    }
  } catch (error) {
    console.error('Payment initialization error:', error)
    return {
      success: false,
      reference: '',
      message: error instanceof Error ? error.message : 'Payment initialization failed'
    }
  }
}

export async function verifyPayment(reference: string) {
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    })

    const data = await response.json()
    
    if (!data.status) {
      throw new Error(data.message || 'Payment verification failed')
    }

    // Update order status if payment is successful
    if (data.data.status === 'success') {
      const order = await prisma.order.findFirst({
        where: { paymentReference: reference }
      })

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PAID',
            paidAt: new Date()
          }
        })
      }
    }

    return {
      success: data.data.status === 'success',
      reference: data.data.reference,
      message: data.data.gateway_response
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return {
      success: false,
      reference,
      message: error instanceof Error ? error.message : 'Payment verification failed'
    }
  }
} 