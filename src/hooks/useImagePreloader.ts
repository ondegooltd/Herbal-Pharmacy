import { useState, useEffect } from 'react';

interface UseImagePreloaderOptions {
  priority?: boolean;
  quality?: number;
  width?: number;
  height?: number;
}

export function useImagePreloader(
  imageSources: string[],
  options: UseImagePreloaderOptions = {}
) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imageSources.length === 0) {
      setIsLoading(false);
      return;
    }

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(src));
          resolve();
        };
        
        img.onerror = () => {
          setFailedImages(prev => new Set(prev).add(src));
          resolve();
        };

        // Optimize Pexels URLs
        if (src.includes('pexels.com')) {
          const url = new URL(src);
          url.searchParams.set('auto', 'compress');
          url.searchParams.set('cs', 'tinysrgb');
          
          if (options.width) url.searchParams.set('w', options.width.toString());
          if (options.height) url.searchParams.set('h', options.height.toString());
          if (options.quality && options.quality < 100) {
            url.searchParams.set('q', options.quality.toString());
          }
          
          img.src = url.toString();
        } else {
          img.src = src;
        }

        // Set priority for critical images
        if (options.priority) {
          img.loading = 'eager';
          img.decoding = 'sync';
        } else {
          img.loading = 'lazy';
          img.decoding = 'async';
        }
      });
    };

    const preloadAllImages = async () => {
      setIsLoading(true);
      
      if (options.priority) {
        // Load priority images sequentially
        for (const src of imageSources) {
          await preloadImage(src);
        }
      } else {
        // Load non-priority images in parallel
        await Promise.all(imageSources.map(preloadImage));
      }
      
      setIsLoading(false);
    };

    preloadAllImages();
  }, [imageSources, options.priority, options.quality, options.width, options.height]);

  return {
    loadedImages,
    failedImages,
    isLoading,
    loadedCount: loadedImages.size,
    failedCount: failedImages.size,
    totalCount: imageSources.length,
    progress: imageSources.length > 0 ? (loadedImages.size + failedImages.size) / imageSources.length : 1
  };
}

export function useImageOptimization() {
  const optimizeImageUrl = (
    src: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpeg' | 'png';
      fit?: 'crop' | 'contain' | 'cover';
    } = {}
  ): string => {
    if (!src.includes('pexels.com')) {
      return src;
    }

    try {
      const url = new URL(src);
      
      // Add compression
      url.searchParams.set('auto', 'compress');
      url.searchParams.set('cs', 'tinysrgb');
      
      // Dimensions
      if (options.width) url.searchParams.set('w', options.width.toString());
      if (options.height) url.searchParams.set('h', options.height.toString());
      
      // Fit mode
      if (options.fit && options.width && options.height) {
        url.searchParams.set('fit', options.fit);
      }
      
      // Quality
      if (options.quality && options.quality < 100) {
        url.searchParams.set('q', options.quality.toString());
      }
      
      // Format (Pexels auto-detects best format, but we can hint)
      if (options.format === 'webp') {
        url.searchParams.set('fm', 'webp');
      }
      
      return url.toString();
    } catch (error) {
      console.warn('Failed to optimize image URL:', error);
      return src;
    }
  };

  const generateSrcSet = (
    src: string,
    sizes: Array<{ width: number; quality?: number }>
  ): string => {
    return sizes
      .map(({ width, quality = 80 }) => {
        const optimizedUrl = optimizeImageUrl(src, { width, quality });
        return `${optimizedUrl} ${width}w`;
      })
      .join(', ');
  };

  return {
    optimizeImageUrl,
    generateSrcSet
  };
}