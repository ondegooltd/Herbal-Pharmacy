import { useState, useEffect, useCallback, useMemo } from 'react';
import { imageOptimizationService } from '../services/imageOptimizationService';
import { Product } from '../types';

interface UseImageOptimizationOptions {
  preloadCritical?: boolean;
  type?: 'thumbnail' | 'card' | 'detail' | 'hero';
  priority?: boolean;
}

export function useImageOptimization(
  images: string[],
  options: UseImageOptimizationOptions = {}
) {
  const [optimizedImages, setOptimizedImages] = useState<Map<string, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  const { preloadCritical = false, type = 'card', priority = false } = options;

  // Memoize the images array to prevent unnecessary re-renders
  const memoizedImages = useMemo(() => images, [JSON.stringify(images)]);

  useEffect(() => {
    let isMounted = true;

    const optimizeImages = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      const optimizedMap = new Map();

      // Generate optimized data for all images
      memoizedImages.forEach(src => {
        const optimizedData = imageOptimizationService.generateResponsiveImageData(src, type);
        optimizedMap.set(src, optimizedData);
      });

      if (isMounted) {
        setOptimizedImages(optimizedMap);
      }

      // Preload critical images if requested
      if (preloadCritical && memoizedImages.length > 0) {
        try {
          await imageOptimizationService.preloadImages(
            priority ? memoizedImages.slice(0, 4) : memoizedImages.slice(0, 2),
            type
          );
        } catch (error) {
          console.warn('Failed to preload some images:', error);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    if (memoizedImages.length > 0) {
      optimizeImages();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [memoizedImages, type, preloadCritical, priority]);

  const getOptimizedImage = useCallback((src: string) => {
    return optimizedImages.get(src);
  }, [optimizedImages]);

  const preloadImage = useCallback(async (src: string) => {
    try {
      await imageOptimizationService.preloadImages([src], type);
      setLoadedCount(prev => prev + 1);
    } catch (error) {
      setFailedCount(prev => prev + 1);
      console.warn('Failed to preload image:', src, error);
    }
  }, [type]);

  return {
    optimizedImages,
    getOptimizedImage,
    preloadImage,
    isLoading,
    loadedCount,
    failedCount,
    totalCount: memoizedImages.length,
    progress: memoizedImages.length > 0 ? (loadedCount + failedCount) / memoizedImages.length : 1
  };
}

export function useProductImageOptimization(products: Product[]) {
  const [optimizedProducts, setOptimizedProducts] = useState<Map<string, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Memoize products array to prevent unnecessary re-renders
  const memoizedProducts = useMemo(() => products, [JSON.stringify(products)]);

  useEffect(() => {
    let isMounted = true;

    const optimizeProductImages = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      const optimizedMap = new Map();

      // Process products in chunks to prevent UI blocking
      const chunkSize = 5;
      for (let i = 0; i < memoizedProducts.length; i += chunkSize) {
        if (!isMounted) break;

        const chunk = memoizedProducts.slice(i, i + chunkSize);
        await Promise.all(
          chunk.map(async (product) => {
            const optimizedImages = imageOptimizationService.getOptimizedProductImages(product);
            optimizedMap.set(product.id, {
              ...product,
              optimizedImages
            });
          })
        );

        // Update state with processed chunk
        if (isMounted) {
          setOptimizedProducts(prev => new Map([...prev, ...optimizedMap]));
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    if (memoizedProducts.length > 0) {
      optimizeProductImages();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [memoizedProducts]);

  const getOptimizedProduct = useCallback((productId: string) => {
    return optimizedProducts.get(productId);
  }, [optimizedProducts]);

  return {
    optimizedProducts,
    getOptimizedProduct,
    isLoading
  };
}

export function useImagePerformanceMonitoring() {
  const [metrics, setMetrics] = useState({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
    totalDataTransferred: 0
  });

  const trackImageLoad = useCallback((url: string, loadTime: number, fileSize: number) => {
    setMetrics(prev => ({
      ...prev,
      loadedImages: prev.loadedImages + 1,
      totalImages: prev.totalImages + 1,
      averageLoadTime: (prev.averageLoadTime * (prev.loadedImages - 1) + loadTime) / prev.loadedImages,
      totalDataTransferred: prev.totalDataTransferred + fileSize
    }));
  }, []);

  const trackImageError = useCallback((url: string) => {
    setMetrics(prev => ({
      ...prev,
      failedImages: prev.failedImages + 1,
      totalImages: prev.totalImages + 1
    }));
  }, []);

  const getPerformanceReport = useCallback(() => {
    const successRate = metrics.totalImages > 0 
      ? (metrics.loadedImages / metrics.totalImages) * 100 
      : 0;

    return {
      ...metrics,
      successRate: `${successRate.toFixed(1)}%`,
      averageLoadTime: `${metrics.averageLoadTime.toFixed(0)}ms`,
      totalDataTransferred: `${(metrics.totalDataTransferred / 1024).toFixed(1)} MB`
    };
  }, [metrics]);

  return {
    metrics,
    trackImageLoad,
    trackImageError,
    getPerformanceReport
  };
}