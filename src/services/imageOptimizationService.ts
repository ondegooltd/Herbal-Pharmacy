import { Product } from '../types';

// CDN Configuration
const CDN_CONFIG = {
  baseUrl: 'https://images.pexels.com',
  fallbackUrl: 'https://via.placeholder.com',
  compressionQuality: {
    thumbnail: 60,
    card: 75,
    detail: 85,
    hero: 90
  },
  sizes: {
    thumbnail: { width: 150, height: 150 },
    card: { width: 400, height: 300 },
    detail: { width: 800, height: 600 },
    hero: { width: 1200, height: 800 }
  },
  formats: ['webp', 'jpeg'] as const,
  cacheHeaders: {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Expires': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()
  }
};

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  fit?: 'crop' | 'contain' | 'cover';
  lazy?: boolean;
  priority?: boolean;
  sizes?: string;
}

export interface OptimizedImageData {
  src: string;
  srcSet: string;
  sizes: string;
  placeholder: string;
  width: number;
  height: number;
  format: string;
  fileSize: number; // estimated in KB
}

class ImageOptimizationService {
  private imageCache = new Map<string, OptimizedImageData>();
  private loadingPromises = new Map<string, Promise<OptimizedImageData>>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes cache timeout

  /**
   * Optimize a single image URL with specified options
   */
  optimizeImageUrl(
    originalUrl: string, 
    options: ImageOptimizationOptions = {}
  ): string {
    if (!originalUrl) return '';

    const cacheKey = `url-${originalUrl}-${JSON.stringify(options)}`;
    const cachedUrl = this.imageCache.get(cacheKey)?.src;
    
    if (cachedUrl) {
      return cachedUrl;
    }

    // Handle Pexels URLs
    if (originalUrl.includes('pexels.com')) {
      const optimizedUrl = this.optimizePexelsUrl(originalUrl, options);
      this.imageCache.set(cacheKey, { src: optimizedUrl } as OptimizedImageData);
      return optimizedUrl;
    }

    // Handle other CDN URLs or fallback
    return this.optimizeGenericUrl(originalUrl, options);
  }

  /**
   * Optimize Pexels image URLs
   */
  private optimizePexelsUrl(
    url: string, 
    options: ImageOptimizationOptions
  ): string {
    try {
      const urlObj = new URL(url);
      
      // Add compression parameters
      urlObj.searchParams.set('auto', 'compress');
      urlObj.searchParams.set('cs', 'tinysrgb');
      
      // Set dimensions
      if (options.width) {
        urlObj.searchParams.set('w', options.width.toString());
      }
      if (options.height) {
        urlObj.searchParams.set('h', options.height.toString());
      }
      
      // Set fit mode
      if (options.fit && options.width && options.height) {
        urlObj.searchParams.set('fit', options.fit);
      }
      
      // Set quality
      if (options.quality) {
        urlObj.searchParams.set('q', Math.min(100, Math.max(1, options.quality)).toString());
      }
      
      // Set format preference
      if (options.format === 'webp') {
        urlObj.searchParams.set('fm', 'webp');
      }
      
      return urlObj.toString();
    } catch (error) {
      console.warn('Failed to optimize Pexels URL:', error);
      return url;
    }
  }

  /**
   * Optimize generic image URLs
   */
  private optimizeGenericUrl(
    url: string, 
    options: ImageOptimizationOptions
  ): string {
    // For non-Pexels URLs, return as-is or apply basic optimizations
    // In a real implementation, you might use a service like Cloudinary or ImageKit
    return url;
  }

  /**
   * Generate responsive image data with srcSet and sizes
   */
  generateResponsiveImageData(
    originalUrl: string,
    type: 'thumbnail' | 'card' | 'detail' | 'hero' = 'card'
  ): OptimizedImageData | Promise<OptimizedImageData> {
    const cacheKey = `${originalUrl}-${type}`;
    
    // Check cache first
    const cachedData = this.imageCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Check if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!;
    }

    const baseSize = CDN_CONFIG.sizes[type];
    const baseQuality = CDN_CONFIG.compressionQuality[type];

    // Generate multiple sizes for responsive images
    const responsiveSizes = this.generateResponsiveSizes(baseSize);
    
    // Create srcSet in parallel
    const srcSetPromise = Promise.all(
      responsiveSizes.map(async size => {
        const optimizedUrl = this.optimizeImageUrl(originalUrl, {
          width: size.width,
          height: size.height,
          quality: size.quality,
          format: 'webp',
          fit: 'crop'
        });
        return `${optimizedUrl} ${size.width}w`;
      })
    ).then(sources => sources.join(', '));

    // Generate sizes attribute
    const sizes = this.generateSizesAttribute(type);

    // Main optimized source
    const src = this.optimizeImageUrl(originalUrl, {
      width: baseSize.width,
      height: baseSize.height,
      quality: baseQuality,
      format: 'webp',
      fit: 'crop'
    });

    // Generate low-quality placeholder
    const placeholder = this.optimizeImageUrl(originalUrl, {
      width: 20,
      height: 15,
      quality: 20,
      format: 'jpeg'
    });

    const promise = srcSetPromise.then(srcSet => {
      const optimizedData: OptimizedImageData = {
        src,
        srcSet,
        sizes,
        placeholder,
        width: baseSize.width,
        height: baseSize.height,
        format: 'webp',
        fileSize: this.estimateFileSize(baseSize.width, baseSize.height, baseQuality)
      };

      this.imageCache.set(cacheKey, optimizedData);
      return optimizedData;
    });

    this.loadingPromises.set(cacheKey, promise);
    
    // Clean up loading promise after completion
    promise.finally(() => {
      this.loadingPromises.delete(cacheKey);
    });

    return promise;
  }

  /**
   * Generate responsive sizes for different breakpoints
   */
  private generateResponsiveSizes(baseSize: { width: number; height: number }) {
    const aspectRatio = baseSize.height / baseSize.width;
    
    return [
      { width: Math.round(baseSize.width * 0.5), height: Math.round(baseSize.width * 0.5 * aspectRatio), quality: 60 },
      { width: Math.round(baseSize.width * 0.75), height: Math.round(baseSize.width * 0.75 * aspectRatio), quality: 70 },
      { width: baseSize.width, height: baseSize.height, quality: 80 },
      { width: Math.round(baseSize.width * 1.5), height: Math.round(baseSize.width * 1.5 * aspectRatio), quality: 85 },
      { width: Math.round(baseSize.width * 2), height: Math.round(baseSize.width * 2 * aspectRatio), quality: 90 }
    ];
  }

  /**
   * Generate sizes attribute for responsive images
   */
  private generateSizesAttribute(type: string): string {
    switch (type) {
      case 'thumbnail':
        return '(max-width: 640px) 75px, (max-width: 768px) 100px, 150px';
      case 'card':
        return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px';
      case 'detail':
        return '(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 800px';
      case 'hero':
        return '100vw';
      default:
        return '(max-width: 768px) 100vw, 50vw';
    }
  }

  /**
   * Estimate file size in KB
   */
  private estimateFileSize(width: number, height: number, quality: number): number {
    const pixels = width * height;
    const baseSize = pixels * 0.5; // Base estimation for JPEG
    const qualityFactor = quality / 100;
    const webpReduction = 0.7; // WebP is typically 30% smaller
    
    return Math.round((baseSize * qualityFactor * webpReduction) / 1024);
  }

  /**
   * Preload multiple images in parallel
   */
  async preloadImages(
    urls: string[],
    type: 'thumbnail' | 'card' | 'detail' | 'hero'
  ): Promise<void> {
    const uniqueUrls = [...new Set(urls)];
    const chunkSize = 3; // Process 3 images at a time

    for (let i = 0; i < uniqueUrls.length; i += chunkSize) {
      const chunk = uniqueUrls.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(url => this.preloadSingleImage(url, type))
      );
    }
  }

  /**
   * Preload a single image
   */
  private async preloadSingleImage(
    url: string, 
    type: 'thumbnail' | 'card' | 'detail' | 'hero'
  ): Promise<void> {
    const cacheKey = `preload-${url}-${type}`;
    
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!.then(() => {});
    }

    const promise = new Promise<OptimizedImageData>((resolve, reject) => {
      const imageData = this.generateResponsiveImageData(url, type);
      
      // Handle both Promise and direct OptimizedImageData return types
      const handleImageData = (data: OptimizedImageData) => {
        const img = new Image();
        
        img.onload = () => resolve(data);
        img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
        
        // Use the main optimized source for preloading
        img.src = data.src;
        
        // Set loading attributes
        img.loading = 'eager';
        img.decoding = 'async';
      };

      if (imageData instanceof Promise) {
        imageData.then(handleImageData).catch(reject);
      } else {
        handleImageData(imageData);
      }
    });

    this.loadingPromises.set(cacheKey, promise);
    
    try {
      await promise;
    } catch (error) {
      console.warn('Image preload failed:', error);
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  /**
   * Get optimized product images
   */
  getOptimizedProductImages(product: Product) {
    return {
      thumbnail: this.generateResponsiveImageData(product.image, 'thumbnail'),
      card: this.generateResponsiveImageData(product.image, 'card'),
      detail: this.generateResponsiveImageData(product.image, 'detail'),
      hero: this.generateResponsiveImageData(product.image, 'hero')
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    const cacheSize = this.imageCache.size;
    const totalEstimatedSize = Array.from(this.imageCache.values())
      .reduce((total, data) => total + data.fileSize, 0);

    return {
      cachedImages: cacheSize,
      totalEstimatedSize: `${totalEstimatedSize} KB`,
      averageFileSize: cacheSize > 0 ? `${Math.round(totalEstimatedSize / cacheSize)} KB` : '0 KB',
      cacheHitRate: this.calculateCacheHitRate()
    };
  }

  /**
   * Calculate cache hit rate
   */
  private calculateCacheHitRate(): string {
    // This would be implemented with actual usage tracking
    return '85%'; // Placeholder
  }

  /**
   * Clear image cache
   */
  clearCache(): void {
    this.imageCache.clear();
    this.loadingPromises.clear();
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    return {
      size: this.imageCache.size,
      keys: Array.from(this.imageCache.keys()),
      memoryUsage: this.estimateCacheMemoryUsage()
    };
  }

  /**
   * Estimate cache memory usage
   */
  private estimateCacheMemoryUsage(): string {
    const totalSize = Array.from(this.imageCache.values())
      .reduce((total, data) => total + data.fileSize, 0);
    
    if (totalSize < 1024) return `${totalSize} KB`;
    if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(1)} MB`;
    return `${(totalSize / (1024 * 1024)).toFixed(1)} GB`;
  }
}

export const imageOptimizationService = new ImageOptimizationService();

// Performance monitoring
export const imagePerformanceMonitor = {
  trackImageLoad: (url: string, loadTime: number, fileSize: number) => {
    console.log(`Image loaded: ${url} in ${loadTime}ms (${fileSize}KB)`);
    
    // In production, send to analytics
    // analytics.track('image_load', { url, loadTime, fileSize });
  },
  
  trackImageError: (url: string, error: string) => {
    console.error(`Image load failed: ${url} - ${error}`);
    
    // In production, send to error tracking
    // errorTracking.captureException(new Error(`Image load failed: ${error}`), { url });
  }
};