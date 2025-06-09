import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Plus, Minus, ArrowRight, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showCheckoutButton, setShowCheckoutButton] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Get current quantity of this product in cart
  const cartItem = items.find(item => item.product.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  // Reset local quantity when cart changes
  useEffect(() => {
    if (cartQuantity > 0) {
      setQuantity(1); // Reset to 1 for next addition
    }
  }, [cartQuantity]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdding) return; // Prevent double-clicking
    
    setIsAdding(true);
    setJustAdded(true);
    
    try {
      addToCart(product, quantity);
      setShowCheckoutButton(true);
      
      // Hide success indicator after 2 seconds
      setTimeout(() => {
        setJustAdded(false);
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
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {product.originalPrice && (
            <div className="absolute top-3 left-3 bg-accent text-white px-2 py-1 rounded-full text-xs font-semibold">
              SALE
            </div>
          )}
          
          {/* Cart quantity indicator */}
          {cartQuantity > 0 && (
            <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
              {cartQuantity} in cart
            </div>
          )}
          
          <button className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Heart className="h-4 w-4 text-neutral-medium hover:text-accent transition-colors" />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="font-heading font-semibold text-neutral-dark mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-secondary fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-neutral-medium ml-2">
              ({product.reviews})
            </span>
          </div>
          
          <p className="text-sm text-neutral-medium mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-primary">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-neutral-medium line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Enhanced Quantity Controls with Cart Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-neutral-dark">Qty:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={(e) => updateQuantity(quantity - 1, e)}
                  className="p-1 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={(e) => updateQuantity(quantity + 1, e)}
                  className="p-1 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
            
            {/* Cart status indicator */}
            {cartQuantity > 0 && (
              <div className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                {cartQuantity} in cart
              </div>
            )}
          </div>

          {/* Success Message */}
          {justAdded && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3 flex items-center animate-fade-in">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-800 text-sm font-medium">
                Added {quantity} to cart!
              </span>
            </div>
          )}

          {/* Enhanced Add to Cart Section */}
          <div className="space-y-2">
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
          
          {!product.inStock && (
            <div className="text-center mt-2">
              <span className="text-sm text-accent font-medium">Out of Stock</span>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </Link>
  );
}