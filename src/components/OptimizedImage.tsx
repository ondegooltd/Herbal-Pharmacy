import React, { useState, useRef, useEffect } from 'react';
import { Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { imageOptimizationService, imagePerformanceMonitor } from '../services/imageOptimizationService';

interface OptimizedImageProps {
  src: string;
  alt: string;
  type?: 'thumbnail' | 'card' | 'detail' | 'hero';
  className?: string;
  lazy?: boolean;
  priority?: boolean;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  style?: React.CSSProperties;
}

export default function OptimizedImage({
  src,
  alt,
  type = 'card',
  className = '',
  lazy = true,
  priority = false,
  fallbackSrc,
  onLoad,
  onError,
  style
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [loadStartTime, setLoadStartTime] = useState<number>(0);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get optimized image data
  const imageData = imageOptimizationService.generateResponsiveImageData(src, type);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, isInView]);

  // Handle image load
  const handleLoad = () => {
    const loadTime = Date.now() - loadStartTime;
    setIsLoaded(true);
    onLoad?.();
    
    // Track performance
    imagePerformanceMonitor.trackImageLoad(src, loadTime, imageData.fileSize);
  };

  // Handle image error
  const handleError = () => {
    const errorMessage = `Failed to load image: ${src}`;
    setHasError(true);
    onError?.(errorMessage);
    
    // Track error
    imagePerformanceMonitor.trackImageError(src, errorMessage);
  };

  // Start loading timer when image starts loading
  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      setLoadStartTime(Date.now());
    }
  }, [isInView, isLoaded, hasError]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Placeholder/Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
          {/* Low-quality placeholder */}
          <img
            src={imageData.placeholder}
            alt=""
            className="w-full h-full object-cover opacity-50 blur-sm"
            aria-hidden="true"
          />
          
          {/* Loading indicator */}
          {isInView && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <div className="text-center">
                <Loader2 className="w-6 h-6 text-gray-500 animate-spin mx-auto mb-2" />
                <span className="text-xs text-gray-600">Loading...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lazy loading placeholder */}
      {!isInView && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
            <span className="text-xs">Image</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
          <div className="text-center text-red-600">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <span className="text-xs">Failed to load</span>
          </div>
        </div>
      )}

      {/* Main Optimized Image */}
      {isInView && !hasError && (
        <picture>
          {/* WebP source for modern browsers */}
          <source
            srcSet={imageData.srcSet}
            sizes={imageData.sizes}
            type="image/webp"
          />
          
          {/* Fallback JPEG source */}
          <source
            srcSet={imageData.srcSet.replace(/fm=webp/g, 'fm=jpeg')}
            sizes={imageData.sizes}
            type="image/jpeg"
          />
          
          {/* Main image element */}
          <img
            ref={imgRef}
            src={imageData.src}
            alt={alt}
            loading={lazy && !priority ? 'lazy' : 'eager'}
            decoding={priority ? 'sync' : 'async'}
            width={imageData.width}
            height={imageData.height}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              filter: isLoaded ? 'none' : 'blur(2px)',
            }}
          />
        </picture>
      )}

      {/* Fallback Image */}
      {hasError && fallbackSrc && (
        <img
          src={fallbackSrc}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-75"
          onLoad={() => {
            setHasError(false);
            setIsLoaded(true);
          }}
        />
      )}

      {/* Progressive Enhancement Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}