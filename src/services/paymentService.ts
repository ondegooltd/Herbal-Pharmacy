import { CartItem } from '../types';

interface PaystackConfig {
  publicKey: string;
  secretKey: string;
}

interface PaymentResponse {
  success: boolean;
  reference: string;
  message: string;
}

class PaymentService {
  private config: PaystackConfig;

  constructor(config: PaystackConfig) {
    this.config = config;
  }

  async initializePayment(
    amount: number,
    email: string,
    items: CartItem[],
    metadata: Record<string, any> = {}
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to pesewas
          email,
          currency: 'GHS',
          callback_url: `${window.location.origin}/payment/verify`,
          metadata: {
            ...metadata,
            items: items.map(item => ({
              id: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        })
      });

      const data = await response.json();
      
      if (!data.status) {
        throw new Error(data.message || 'Payment initialization failed');
      }

      return {
        success: true,
        reference: data.data.reference,
        message: 'Payment initialized successfully'
      };
    } catch (error) {
      console.error('Payment initialization error:', error);
      return {
        success: false,
        reference: '',
        message: error instanceof Error ? error.message : 'Payment initialization failed'
      };
    }
  }

  async verifyPayment(reference: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`
        }
      });

      const data = await response.json();
      
      if (!data.status) {
        throw new Error(data.message || 'Payment verification failed');
      }

      return {
        success: data.data.status === 'success',
        reference: data.data.reference,
        message: data.data.gateway_response
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        reference,
        message: error instanceof Error ? error.message : 'Payment verification failed'
      };
    }
  }
}

export const paymentService = new PaymentService({
  publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
  secretKey: import.meta.env.VITE_PAYSTACK_SECRET_KEY || ''
}); 