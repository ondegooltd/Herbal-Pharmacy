import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { Product } from '../types';

interface SearchBarProps {
  onClose?: () => void;
  className?: string;
  placeholder?: string;
  variant?: 'default' | 'hero';
}

export default function SearchBar({ 
  onClose, 
  className = '', 
  placeholder = 'Search products...', 
  variant = 'default' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search effect
  useEffect(() => {
    if (query.length > 1) {
      setIsLoading(true);
      
      // Simulate API delay for realistic loading state
      const searchTimeout = setTimeout(() => {
        const filteredProducts = products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, 8); // Show max 8 results
        
        setResults(filteredProducts);
        setIsOpen(true);
        setIsLoading(false);
      }, 300); // 300ms delay for debouncing

      return () => clearTimeout(searchTimeout);
    } else {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
    }
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setIsLoading(false);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };

  // Highlight matching text in search results
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-900 font-semibold">
          {part}
        </span>
      ) : part
    );
  };

  const baseInputClasses = variant === 'hero' 
    ? "w-full pl-14 pr-14 py-4 text-lg border-2 border-white/30 bg-white/95 backdrop-blur-md rounded-2xl focus:ring-2 focus:ring-secondary focus:border-secondary focus:bg-white transition-all duration-300 placeholder-gray-600 shadow-lg"
    : "w-full pl-12 pr-12 py-3 border-2 border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 placeholder-gray-500 shadow-sm hover:shadow-md";

  const iconSize = variant === 'hero' ? 'h-6 w-6' : 'h-5 w-5';
  const iconPosition = variant === 'hero' ? 'left-4 top-4' : 'left-3 top-3';
  const clearPosition = variant === 'hero' ? 'right-4 top-4' : 'right-3 top-3';

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          className={baseInputClasses}
        />
        
        {/* Search Icon */}
        <div className={`absolute ${iconPosition} text-gray-500`}>
          {isLoading ? (
            <Loader2 className={`${iconSize} animate-spin`} />
          ) : (
            <Search className={iconSize} />
          )}
        </div>
        
        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className={`absolute ${clearPosition} text-gray-500 hover:text-gray-700 transition-colors duration-200 hover:scale-110`}
          >
            <X className={iconSize} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 mt-2 max-h-96 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-600">
                  {results.length} result{results.length !== 1 ? 's' : ''} found for "{query}"
                </p>
              </div>
              
              {/* Results List */}
              <div className="max-h-80 overflow-y-auto">
                {results.map((product, index) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={handleResultClick}
                    className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0 group"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.3s ease-out forwards'
                    }}
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden rounded-lg mr-4 group-hover:scale-105 transition-transform duration-200">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover shadow-sm"
                      />
                      {product.originalPrice && (
                        <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                          SALE
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate text-base group-hover:text-primary transition-colors duration-200">
                        {highlightMatch(product.name, query)}
                      </h4>
                      <p className="text-sm text-gray-500 truncate mb-1">
                        {highlightMatch(product.description, query)}
                      </p>
                      
                      {/* Price and Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        
                        {/* Rating Stars */}
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow Indicator */}
                    <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* View All Results Footer */}
              <div className="border-t border-gray-100 p-3 bg-gray-50">
                <Link
                  to={`/products?search=${encodeURIComponent(query)}`}
                  onClick={handleResultClick}
                  className="block w-full text-center py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200 border border-primary hover:shadow-md"
                >
                  View all results for "{query}" →
                </Link>
              </div>
            </>
          ) : (
            /* No Results */
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No products found for "{query}"</p>
              <p className="text-sm text-gray-400">Try searching with different keywords</p>
            </div>
          )}
        </div>
      )}
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}