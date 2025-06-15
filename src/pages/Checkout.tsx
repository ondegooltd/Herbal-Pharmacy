import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Truck, 
  Shield, 
  Check, 
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Smartphone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { shippingService } from '../services/shippingService';
import { PaymentService } from '../services/paymentService';
import { API_URL } from '../config';
import type { CartItem, Order } from '../types';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user, addOrder } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingCosts, setShippingCosts] = useState({
    standard: 0,
    express: 0
  });
  const [estimatedDelivery, setEstimatedDelivery] = useState({
    standard: '3-5 business days',
    express: '1-2 business days'
  });
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address.street || '',
    city: user?.address.city || '',
    state: user?.address.state || '',
    zipCode: user?.address.zipCode || '',
    country: user?.address.country || 'Ghana',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Mobile Money Information
    mobileMoneyProvider: 'mtn',
    mobileMoneyNumber: '',
    
    // Order Options
    shippingMethod: 'standard',
    paymentMethod: 'card',
    saveInfo: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMoneyInstructions, setMobileMoneyInstructions] = useState('');
  const [showMobileMoneyModal, setShowMobileMoneyModal] = useState(false);

  // Calculate shipping costs when address or items change
  useEffect(() => {
    if (formData.city && formData.state && items.length > 0) {
      try {
        const address = {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        };

        // Convert cart items to shipping format
        const shippingItems = items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          weight: item.product.weight || 0.5 // Default weight if not specified
        }));

        // Calculate costs for both methods
        const standardCalculation = shippingService.calculateShipping(address, shippingItems, 'standard');
        const expressCalculation = shippingService.calculateShipping(address, shippingItems, 'express');

        setShippingCosts({
          standard: standardCalculation.total,
          express: expressCalculation.total
        });

        setEstimatedDelivery({
          standard: standardCalculation.estimatedDays,
          express: expressCalculation.estimatedDays
        });
      } catch (error) {
        console.error('Error calculating shipping:', error);
        // Set default costs if calculation fails
        setShippingCosts({
          standard: 15.00,
          express: 25.00
        });
      }
    }
  }, [formData.city, formData.state, formData.address, formData.zipCode, formData.country, items]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State/Region is required';
      // Removed zipCode validation - it's now truly optional
    }

    if (step === 2) {
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
        if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
        if (!formData.cvv) newErrors.cvv = 'CVV is required';
        if (!formData.cardName) newErrors.cardName = 'Cardholder name is required';
      } else if (formData.paymentMethod === 'mobile-money') {
        if (!formData.mobileMoneyNumber) newErrors.mobileMoneyNumber = 'Mobile money number is required';
        if (!formData.mobileMoneyProvider) newErrors.mobileMoneyProvider = 'Please select a provider';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const createShippingAddress = async (addressData: any) => {
    const token = localStorage.getItem('token');
    const transformedData = {
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      country: addressData.country || 'Ghana',
      zipCode: addressData.postalCode,
      isDefault: false
    };

    const response = await fetch(`${API_URL}/api/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(transformedData),
    });

    if (!response.ok) {
      throw new Error('Failed to create shipping address');
    }

    return response.json();
  };

  const createOrder = async (orderData: {
    items: CartItem[]
    shippingAddress: {
      street: string
      city: string
      state: string
      country: string
      postalCode: string
    }
    paymentMethod: string
    shippingCost: number
    total: number
    shippingMethod: 'standard' | 'express'
  }): Promise<Order | null> => {
    try {
      // First create the shipping address
      const shippingAddressId = await createShippingAddress(orderData.shippingAddress);
      if (!shippingAddressId) {
        throw new Error('Failed to create shipping address');
      }

      // Transform the data to match the backend's expected format
      const transformedData = {
        items: orderData.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        shippingAddressId,
        shippingMethod: orderData.shippingMethod === 'express' ? 'EXPRESS' : 'STANDARD',
        paymentMethod: orderData.paymentMethod.toUpperCase()
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify(transformedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const data = await response.json();
      return data as Order;
    } catch (error) {
      console.error('Create order error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create order first
      const order = await createOrder({
        items: items,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.zipCode
        },
        paymentMethod: formData.paymentMethod,
        shippingCost: formData.shippingMethod === 'express' ? shippingCosts.express : shippingCosts.standard,
        total: total + (formData.shippingMethod === 'express' ? shippingCosts.express : shippingCosts.standard),
        shippingMethod: formData.shippingMethod as 'standard' | 'express'
      });

      if (!order) {
        throw new Error('Failed to create order');
      }

      if (formData.paymentMethod === 'card') {
        // Initialize payment with Paystack
        const result = await PaymentService.initializePayment(
          order.total,
          user?.email || '',
          order.id,
          {
            orderId: order.id,
            items: order.items.map(item => ({
              id: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        );

        if (!result.success) {
          throw new Error(result.message);
        }

        // Initialize Paystack inline checkout
        const handler = (window as any).PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
          email: user?.email,
          amount: order.total * 100, // Convert to pesewas
          currency: 'GHS',
          ref: result.data.reference,
          callback: (response: any) => {
            // Handle successful payment
            clearCart();
            navigate(`/payment/verify?reference=${response.reference}&orderId=${order.id}`);
          },
          onClose: () => {
            // Handle payment modal close
            setError('Payment was cancelled');
          }
        });

        handler.openIframe();
      } else if (formData.paymentMethod === 'mobile-money') {
        // Handle mobile money payment
        const result = await PaymentService.initializePayment(
          order.total,
          user?.email || '',
          order.id,
          {
            orderId: order.id,
            paymentMethod: 'mobile_money'
          }
        );

        if (!result.success) {
          throw new Error(result.message);
        }

        // Show mobile money instructions
        setMobileMoneyInstructions(result.data.instructions);
        setShowMobileMoneyModal(true);
      } else {
        // Cash on delivery
        clearCart();
        navigate(`/payment/verify?orderId=${order.id}`);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const subtotal = total;
  const selectedShippingCost = formData.shippingMethod === 'express' ? shippingCosts.express : shippingCosts.standard;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + selectedShippingCost + tax;

  // Ghana-specific regions
  const ghanaRegions = [
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Volta',
    'Northern', 'Upper East', 'Upper West', 'Brong-Ahafo', 'Western North',
    'Ahafo', 'Bono', 'Bono East', 'Oti', 'Savannah', 'North East'
  ];

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-primary hover:text-green-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Cart
          </button>
          <h1 className="font-heading text-3xl font-bold text-neutral-dark">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: 'Shipping', icon: Truck },
              { step: 2, title: 'Payment', icon: CreditCard },
              { step: 3, title: 'Review', icon: Check }
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > step ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= step ? 'text-primary' : 'text-gray-600'
                }`}>
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="font-heading text-xl font-semibold mb-6">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      placeholder="+233 XX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    placeholder="House number, street name, area"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Accra, Kumasi"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => updateFormData('state', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Region</option>
                      {ghanaRegions.map((region) => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={formData.zipCode}
                      onChange={(e) => updateFormData('zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can leave this blank if you don't have a postal code
                    </p>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-4">Shipping Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={formData.shippingMethod === 'standard'}
                        onChange={(e) => updateFormData('shippingMethod', e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Standard Delivery</span>
                          <span className="font-semibold">GH₵ {(shippingCosts.standard * 6).toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-500">{estimatedDelivery.standard} within Ghana</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={formData.shippingMethod === 'express'}
                        onChange={(e) => updateFormData('shippingMethod', e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Express Delivery</span>
                          <span className="font-semibold">GH₵ {(shippingCosts.express * 6).toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-500">{estimatedDelivery.express} (Major cities only)</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="font-heading text-xl font-semibold mb-6">Payment Information</h2>
                
                {/* Payment Method Selection */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-4">Choose Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="mobile-money"
                        checked={formData.paymentMethod === 'mobile-money'}
                        onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <Smartphone className="h-6 w-6 ml-3 mr-3 text-primary" />
                      <div className="flex-1">
                        <span className="font-medium text-lg">Mobile Money</span>
                        <p className="text-sm text-gray-500">MTN, Vodafone, AirtelTigo</p>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-5 bg-yellow-400 rounded text-xs flex items-center justify-center font-bold text-black">MTN</div>
                        <div className="w-8 h-5 bg-red-600 rounded text-xs flex items-center justify-center font-bold text-white">VOD</div>
                        <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center font-bold text-white">AT</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <CreditCard className="h-6 w-6 ml-3 mr-3 text-primary" />
                      <div className="flex-1">
                        <span className="font-medium text-lg">Credit/Debit Card</span>
                        <p className="text-sm text-gray-500">Visa, Mastercard, Verve</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <div className="h-6 w-6 ml-3 mr-3 bg-blue-600 rounded text-white text-sm flex items-center justify-center font-bold">
                        P
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-lg">PayPal</span>
                        <p className="text-sm text-gray-500">Pay with your PayPal account</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Mobile Money Details */}
                {formData.paymentMethod === 'mobile-money' && (
                  <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-900">Mobile Money Details</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Money Provider *
                      </label>
                      <select
                        value={formData.mobileMoneyProvider}
                        onChange={(e) => updateFormData('mobileMoneyProvider', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.mobileMoneyProvider ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="mtn">MTN Mobile Money</option>
                        <option value="vodafone">Vodafone Cash</option>
                        <option value="airteltigo">AirtelTigo Money</option>
                      </select>
                      {errors.mobileMoneyProvider && <p className="text-red-500 text-sm mt-1">{errors.mobileMoneyProvider}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Money Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="0XX XXX XXXX"
                        value={formData.mobileMoneyNumber}
                        onChange={(e) => updateFormData('mobileMoneyNumber', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.mobileMoneyNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.mobileMoneyNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileMoneyNumber}</p>}
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> You will receive a prompt on your phone to authorize the payment. 
                        Please ensure your mobile money account has sufficient balance.
                      </p>
                    </div>
                  </div>
                )}

                {/* Card Details */}
                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => updateFormData('cardNumber', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => updateFormData('expiryDate', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => updateFormData('cvv', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.cvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={formData.cardName}
                        onChange={(e) => updateFormData('cardName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.cardName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="font-heading text-xl font-semibold mb-6">Review Your Order</h2>
                
                {/* Shipping Address */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Address
                  </h3>
                  <p className="text-gray-700">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}<br />
                    {formData.city}, {formData.state} {formData.zipCode && formData.zipCode}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-1">
                    <p className="text-gray-700 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {formData.email}
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {formData.phone}
                    </p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                  <p className="text-gray-700">
                    {formData.paymentMethod === 'card' && 'Credit/Debit Card'}
                    {formData.paymentMethod === 'mobile-money' && `Mobile Money (${formData.mobileMoneyProvider.toUpperCase()})`}
                    {formData.paymentMethod === 'paypal' && 'PayPal'}
                    {formData.paymentMethod === 'card' && formData.cardNumber && (
                      <span className="ml-2">ending in {formData.cardNumber.slice(-4)}</span>
                    )}
                    {formData.paymentMethod === 'mobile-money' && formData.mobileMoneyNumber && (
                      <span className="ml-2">({formData.mobileMoneyNumber})</span>
                    )}
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-24">
              <h2 className="font-heading text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm">
                      GH₵ {(item.product.price * item.quantity * 6).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-6 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>GH₵ {(subtotal * 6).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping ({formData.shippingMethod})</span>
                  <span>GH₵ {(selectedShippingCost * 6).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>GH₵ {(tax * 6).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">GH₵ {(finalTotal * 6).toFixed(2)}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center text-sm text-gray-500 border-t pt-4">
                <Shield className="h-4 w-4 mr-2" />
                <span>Secure 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}