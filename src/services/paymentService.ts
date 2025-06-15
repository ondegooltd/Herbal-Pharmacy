import { API_URL } from '../config'

interface PaymentResponse {
  success: boolean
  message: string
  data?: any
}

export class PaymentService {
  private static async request(endpoint: string, options: RequestInit = {}): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment request failed')
      }

      return data
    } catch (error) {
      console.error('Payment request error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Payment request failed'
      }
    }
  }

  static async initializePayment(amount: number, email: string, orderId: string, metadata?: any): Promise<PaymentResponse> {
    return this.request('/api/payments/initialize', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        email,
        orderId,
        metadata
      })
    })
  }

  static async verifyPayment(reference: string): Promise<PaymentResponse> {
    return this.request('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ reference })
    })
  }
} 