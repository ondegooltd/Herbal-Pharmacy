import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function FloatingCartActions() {
  const { items, getItemCount } = useCart();
  const [showFloating, setShowFloating] = useState(false);
  const [lastItemCount, setLastItemCount] = useState(0);

  useEffect(() => {
    const currentCount = getItemCount();
    
    // Show floating actions when items are added
    if (currentCount > lastItemCount && currentCount > 0) {
      setShowFloating(true);
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        setShowFloating(false);
      }, 10000);
    }
    
    setLastItemCount(currentCount);
  }, [getItemCount, lastItemCount]);

  if (!showFloating || getItemCount() === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-neutral-dark">
                {getItemCount()} item{getItemCount() !== 1 ? 's' : ''} in cart
              </p>
              <p className="text-sm text-neutral-medium">Ready for checkout</p>
            </div>
          </div>
          <button
            onClick={() => setShowFloating(false)}
            className="text-neutral-medium hover:text-neutral-dark p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to="/cart"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-neutral-dark px-4 py-2 rounded-lg transition-colors text-center text-sm font-medium"
          >
            View Cart
          </Link>
          <Link
            to="/checkout"
            className="flex-1 bg-secondary hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}