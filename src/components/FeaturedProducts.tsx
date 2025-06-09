import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { featuredProducts } from '../data/products';
import { useImageOptimization } from '../hooks/useImageOptimization';

export default function FeaturedProducts() {
  // Preload featured product images for better performance
  const productImages = featuredProducts.map(product => product.image);
  const { isLoading, progress } = useImageOptimization(productImages, {
    preloadCritical: true,
    type: 'card',
    priority: true
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-dark mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-neutral-medium">
              Discover our most popular natural health solutions
            </p>
            
            {/* Loading Progress Indicator */}
            {isLoading && (
              <div className="mt-4">
                <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Optimizing images...</p>
              </div>
            )}
          </div>
          <Link
            to="/products"
            className="hidden md:inline-flex items-center text-primary hover:text-green-700 font-semibold transition-colors duration-200 group"
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <ProductCard 
                product={product} 
                priority={index < 2} // Prioritize first 2 images
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8 md:hidden">
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 group"
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}