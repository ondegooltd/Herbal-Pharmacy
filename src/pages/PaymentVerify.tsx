import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { PaymentService } from '../services/paymentService';
import { API_URL } from '../config';

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { updateOrderStatus } = useUser();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get reference from URL params or state
        const reference = searchParams.get('reference') || location.state?.reference;
        const trxref = searchParams.get('trxref') || location.state?.trxref;
        const orderId = location.state?.orderId;

        if (!reference || !trxref) {
          throw new Error('Missing payment reference');
        }

        // Verify the payment
        const response = await PaymentService.verifyPayment(reference);

        if (response.success) {
          setStatus('success');
          setMessage('Payment successful!');
          
          // Update order status
          if (orderId) {
            await updateOrderStatus(orderId, 'paid');
          }

          // Redirect to orders page after 3 seconds
          setTimeout(() => {
            navigate('/account?tab=orders', {
              state: {
                orderId,
                status: 'paid'
              }
            });
          }, 3000);
        } else {
          setStatus('failed');
          setMessage(response.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage(error instanceof Error ? error.message : 'Payment verification failed');
      }
    };

    verifyPayment();
  }, [searchParams, location.state, navigate, updateOrderStatus]);

  return (
    <div className="min-h-screen bg-neutral-light flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-neutral-dark mb-4">
          {status === 'verifying' && 'Verifying Payment...'}
          {status === 'success' && 'Payment Successful!'}
          {status === 'failed' && 'Payment Failed'}
        </h2>
        <p className="text-neutral-dark mb-4">{message}</p>
        {status === 'failed' && (
          <button
            onClick={() => navigate('/checkout')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Return to Checkout
          </button>
        )}
      </div>
    </div>
  );
} 