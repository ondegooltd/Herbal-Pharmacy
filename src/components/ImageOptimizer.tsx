import React, { useState, useRef, useEffect } from 'react';
import { Loader2, AlertCircle, Leaf } from 'lucide-react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  lazy?: boolean;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function ImageOptimizer({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 80,
  lazy = true,
  fallbackSrc,
  onLoad,
  onError
}: ImageOptimizerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  // Optimize image URL for Pexels
  const getOptimizedUrl = (originalSrc: string) => {
    if (!originalSrc.includes('pexels.com')) {
      return originalSrc;
    }

    const url = new URL(originalSrc);
    
    // Add optimization parameters
    url.searchParams.set('auto', 'compress');
    url.searchParams.set('cs', 'tinysrgb');
    
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    if (width && height) url.searchParams.set('fit', 'crop');
    
    // Quality parameter (Pexels uses 'q' for quality)
    if (quality < 100) {
      url.searchParams.set('q', quality.toString());
    }

    return url.toString();
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const optimizedSrc = getOptimizedUrl(src);
  const optimizedFallbackSrc = fallbackSrc ? getOptimizedUrl(fallbackSrc) : undefined;

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Loading State */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
            <span className="text-xs text-gray-500">Loading...</span>
          </div>
        </div>
      )}

      {/* Placeholder for lazy loading */}
      {!isInView && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-xs">Image</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <span className="text-xs">Failed to load</span>
          </div>
        </div>
      )}

      {/* Main Image */}
      {isInView && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            filter: isLoaded ? 'none' : 'blur(5px)',
          }}
        />
      )}

      {/* Fallback Image */}
      {hasError && optimizedFallbackSrc && (
        <img
          src={optimizedFallbackSrc}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-75"
          onLoad={() => setHasError(false)}
        />
      )}

      {/* Progressive Enhancement Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}