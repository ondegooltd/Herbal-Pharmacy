import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { useUser } from '../context/UserContext';

export default function PaymentVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addOrder } = useUser();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [message, setMessage] = useState('Verifying payment...');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      const orderId = searchParams.get('orderId');
      
      if (!reference) {
        setVerificationStatus('failed');
        setMessage('Invalid payment reference');
        return;
      }

      if (!orderId) {
        setVerificationStatus('failed');
        setMessage('Invalid order reference');
        return;
      }

      try {
        const response = await paymentService.verifyPayment(reference);
        
        if (response.success) {
          setVerificationStatus('success');
          setMessage('Payment successful!');
          
          // Update order status
          setIsUpdatingOrder(true);
          try {
            // Add the order with updated status
            addOrder({
              id: orderId,
              userId: '', // This will be set by the context
              items: [], // This will be populated from the cart
              subtotal: 0, // This will be calculated from items
              shippingCost: 0, // This will be calculated
              tax: 0, // This will be calculated
              total: 0, // This will be calculated
              status: 'confirmed',
              createdAt: new Date(),
              shippingAddress: {
                id: 'default',
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'Ghana'
              },
              shippingMethod: 'standard',
              paymentMethod: 'paystack',
              paymentReference: reference
            });
            
            // Redirect to orders page after 3 seconds
            setTimeout(() => {
              navigate('/account?tab=orders', { 
                state: { 
                  orderId,
                  paymentReference: reference,
                  status: 'success'
                }
              });
            }, 3000);
          } catch (updateError) {
            console.error('Failed to update order status:', updateError);
            setMessage('Payment successful, but there was an issue updating your order. Please contact support.');
            // Still redirect after delay
            setTimeout(() => {
              navigate('/account?tab=orders', { 
                state: { 
                  orderId,
                  paymentReference: reference,
                  status: 'pending_update'
                }
              });
            }, 3000);
          } finally {
            setIsUpdatingOrder(false);
          }
        } else {
          setVerificationStatus('failed');
          setMessage(response.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setVerificationStatus('failed');
        setMessage(error instanceof Error ? error.message : 'Payment verification failed');
      }
    };

    verifyPayment();
  }, [searchParams, navigate, addOrder]);

  return (
    <div className="min-h-screen bg-neutral-light flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-card p-8 max-w-md w-full text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          verificationStatus === 'pending' ? 'bg-yellow-100' :
          verificationStatus === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {(verificationStatus === 'pending' || isUpdatingOrder) && (
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          )}
          {verificationStatus === 'success' && !isUpdatingOrder && (
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {verificationStatus === 'failed' && !isUpdatingOrder && (
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-neutral-dark mb-2">
          {isUpdatingOrder ? 'Updating Order Status' :
            verificationStatus === 'pending' ? 'Verifying Payment' :
            verificationStatus === 'success' ? 'Payment Successful' :
            'Payment Failed'}
        </h2>
        
        <p className="text-neutral-medium mb-6">{message}</p>
        
        {verificationStatus === 'failed' && !isUpdatingOrder && (
          <button
            onClick={() => navigate('/checkout')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
} 