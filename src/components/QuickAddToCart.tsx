import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowRight, CheckCircle, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface QuickAddToCartProps {
  product: Product;
  className?: string;
  showQuantity?: boolean;
}

export default function QuickAddToCart({ 
  product, 
  className = '', 
  showQuantity = true 
}: QuickAddToCartProps) {
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCheckoutButton, setShowCheckoutButton] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Get current quantity of this product in cart
  const cartItem = items.find(item => item.product.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  // Reset local quantity when cart changes
  useEffect(() => {
    if (cartQuantity > 0) {
      setQuantity(1); // Reset to 1 for next addition
    }
  }, [cartQuantity]);

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isAdding) return;
    
    setIsAdding(true);
    
    try {
      addToCart(product, quantity);
      setShowSuccess(true);
      setShowCheckoutButton(true);
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      
      // REMOVED: The setTimeout that was hiding the checkout button
      // The button will now remain visible until the user navigates away
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const updateQuantity = (newQuantity: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Cart Status Display */}
      {cartQuantity > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-primary mr-2" />
            <span className="text-primary font-medium text-sm">
              {cartQuantity} already in cart
            </span>
          </div>
          <Link
            to="/cart"
            className="text-primary hover:text-green-700 text-sm font-medium underline"
          >
            View Cart
          </Link>
        </div>
      )}

      {/* Quantity Selector */}
      {showQuantity && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-dark">Add Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={(e) => updateQuantity(quantity - 1, e)}
              className="p-1.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-3 py-1.5 text-sm font-medium min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={(e) => updateQuantity(quantity + 1, e)}
              className="p-1.5 hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 flex items-center animate-pulse">
          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
          <span className="text-green-800 text-sm font-medium">
            Added {quantity} to cart! Total: {cartQuantity + quantity}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className="w-full bg-primary hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center text-sm font-semibold shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
        >
          {isAdding ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? `Add ${quantity} to Cart` : 'Out of Stock'}
            </>
          )}
        </button>

        {/* Proceed to Checkout Button - Now stays visible permanently after adding to cart */}
        <div className={`transition-all duration-300 overflow-hidden ${
          showCheckoutButton ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <Link
            to="/checkout"
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-secondary hover:bg-yellow-500 text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center text-sm font-semibold shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}