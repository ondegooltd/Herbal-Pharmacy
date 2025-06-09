import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Minus, 
  Plus, 
  Shield, 
  Truck, 
  RefreshCw,
  Upload,
  X,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import OptimizedImage from '../components/OptimizedImage';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">Product Not Found</h2>
          <Link to="/products" className="text-primary hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  // Get current quantity of this product in cart
  const cartItem = items.find(item => item.product.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async () => {
    if (isAdding) return;
    
    setIsAdding(true);
    
    try {
      addToCart(product, quantity);
      setShowAddedToCart(true);
      
      // Hide the success message after 3 seconds
      setTimeout(() => {
        setShowAddedToCart(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (!showAddedToCart && cartQuantity === 0) {
      addToCart(product, quantity);
    }
    navigate('/checkout');
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const images = [product.image, product.image, product.image]; // Mock multiple images

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to="/" className="text-primary hover:underline">Home</Link></li>
            <li className="text-neutral-medium">/</li>
            <li><Link to="/products" className="text-primary hover:underline">Products</Link></li>
            <li className="text-neutral-medium">/</li>
            <li className="text-neutral-dark">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-card">
              <OptimizedImage
                src={images[selectedImage]}
                alt={product.name}
                type="detail"
                className="w-full h-96"
                priority={true}
              />
            </div>
            <div className="flex space-x-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-1 bg-white rounded-lg overflow-hidden shadow-sm border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <OptimizedImage
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    type="thumbnail"
                    className="w-full h-20"
                    lazy={false}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-dark mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-secondary fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-neutral-medium">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="font-bold text-3xl text-primary">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-neutral-medium line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              <p className="text-lg text-neutral-medium mb-6">
                {product.description}
              </p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-heading font-semibold text-lg text-neutral-dark mb-3">
                Key Benefits
              </h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-neutral-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Usage */}
            <div>
              <h3 className="font-heading font-semibold text-lg text-neutral-dark mb-3">
                How to Use
              </h3>
              <p className="text-neutral-medium">{product.usage}</p>
            </div>

            {/* Cart Status Display */}
            {cartQuantity > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span className="text-primary font-semibold">
                      {cartQuantity} already in your cart
                    </span>
                  </div>
                  <Link
                    to="/cart"
                    className="text-primary hover:text-green-700 font-medium underline"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}

            {/* Prescription Upload */}
            {product.requiresPrescription && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 mb-3">
                  This product requires a prescription. Please upload your prescription before checkout.
                </p>
                <button
                  onClick={() => setShowPrescriptionModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Prescription
                </button>
              </div>
            )}

            {/* Enhanced Quantity and Cart Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-neutral-dark">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => updateQuantity(quantity - 1)}
                    className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Success Message */}
              {showAddedToCart && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center animate-pulse">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    Added {quantity} to cart! Total in cart: {cartQuantity + quantity}
                  </span>
                </div>
              )}

              {/* Enhanced Action Buttons */}
              <div className="space-y-3">
                {/* Primary Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding}
                  className="w-full bg-primary hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
                >
                  {isAdding ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-3" />
                      {product.inStock ? `Add ${quantity} to Cart` : 'Out of Stock'}
                    </>
                  )}
                </button>

                {/* Proceed to Checkout Button */}
                <button
                  onClick={handleProceedToCheckout}
                  disabled={!product.inStock}
                  className="w-full bg-secondary hover:bg-yellow-500 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
                >
                  <ArrowRight className="h-5 w-5 mr-3" />
                  Proceed to Checkout
                </button>

                {/* Secondary Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <Heart className="h-5 w-5 mr-2" />
                    <span className="font-medium">Add to Wishlist</span>
                  </button>
                  <button className="flex-1 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <Share2 className="h-5 w-5 mr-2" />
                    <span className="font-medium">Share Product</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm text-neutral-medium">Quality Guaranteed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm text-neutral-medium">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                <span className="text-sm text-neutral-medium">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <h2 className="font-heading text-2xl font-bold text-neutral-dark mb-6">
            Customer Reviews
          </h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`h-4 w-4 ${
                            j < 5 ? 'text-secondary fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="font-medium text-neutral-dark">Sarah M.</p>
                  </div>
                  <span className="text-sm text-neutral-medium">2 weeks ago</span>
                </div>
                <p className="text-neutral-medium">
                  Great quality product! I've been using this for a month now and can definitely feel the difference in my energy levels. Highly recommend!
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prescription Upload Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-semibold">Upload Prescription</h3>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="text-neutral-medium hover:text-neutral-dark"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-neutral-dark mb-2">Click to upload or drag files here</p>
              <p className="text-sm text-neutral-medium">PDF, JPG, PNG (Max 5MB)</p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}