// Image performance metrics and monitoring utilities

export interface ImageMetrics {
  url: string;
  loadTime: number;
  fileSize: number;
  format: string;
  dimensions: { width: number; height: number };
  compressionRatio: number;
  cacheHit: boolean;
  timestamp: number;
}

export interface PerformanceReport {
  totalImages: number;
  averageLoadTime: number;
  totalDataTransferred: number;
  cacheHitRate: number;
  formatDistribution: Record<string, number>;
  compressionSavings: number;
  recommendations: string[];
}

class ImageMetricsCollector {
  private metrics: ImageMetrics[] = [];
  private readonly maxMetrics = 1000; // Keep last 1000 metrics

  /**
   * Record image load metrics
   */
  recordImageLoad(metrics: Omit<ImageMetrics, 'timestamp'>) {
    const fullMetrics: ImageMetrics = {
      ...metrics,
      timestamp: Date.now()
    };

    this.metrics.push(fullMetrics);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Image Load Metrics:', fullMetrics);
    }
  }

  /**
   * Generate performance report
   */
  generateReport(timeRange?: { start: number; end: number }): PerformanceReport {
    let relevantMetrics = this.metrics;

    if (timeRange) {
      relevantMetrics = this.metrics.filter(
        m => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      );
    }

    if (relevantMetrics.length === 0) {
      return {
        totalImages: 0,
        averageLoadTime: 0,
        totalDataTransferred: 0,
        cacheHitRate: 0,
        formatDistribution: {},
        compressionSavings: 0,
        recommendations: []
      };
    }

    const totalImages = relevantMetrics.length;
    const averageLoadTime = relevantMetrics.reduce((sum, m) => sum + m.loadTime, 0) / totalImages;
    const totalDataTransferred = relevantMetrics.reduce((sum, m) => sum + m.fileSize, 0);
    const cacheHits = relevantMetrics.filter(m => m.cacheHit).length;
    const cacheHitRate = (cacheHits / totalImages) * 100;

    // Format distribution
    const formatDistribution: Record<string, number> = {};
    relevantMetrics.forEach(m => {
      formatDistribution[m.format] = (formatDistribution[m.format] || 0) + 1;
    });

    // Compression savings calculation
    const originalSizes = relevantMetrics.map(m => m.fileSize / m.compressionRatio);
    const originalTotal = originalSizes.reduce((sum, size) => sum + size, 0);
    const compressionSavings = ((originalTotal - totalDataTransferred) / originalTotal) * 100;

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      totalImages,
      averageLoadTime,
      totalDataTransferred,
      cacheHitRate,
      formatDistribution,
      compressionSavings,
      recommendations: []
    });

    return {
      totalImages,
      averageLoadTime: Math.round(averageLoadTime),
      totalDataTransferred: Math.round(totalDataTransferred / 1024), // Convert to KB
      cacheHitRate: Math.round(cacheHitRate),
      formatDistribution,
      compressionSavings: Math.round(compressionSavings),
      recommendations
    };
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(report: PerformanceReport): string[] {
    const recommendations: string[] = [];

    // Load time recommendations
    if (report.averageLoadTime > 2000) {
      recommendations.push('Consider reducing image sizes or implementing more aggressive compression');
    }

    // Cache recommendations
    if (report.cacheHitRate < 70) {
      recommendations.push('Implement better caching strategies to improve cache hit rate');
    }

    // Format recommendations
    const jpegCount = report.formatDistribution['jpeg'] || 0;
    const webpCount = report.formatDistribution['webp'] || 0;
    
    if (jpegCount > webpCount) {
      recommendations.push('Consider converting more images to WebP format for better compression');
    }

    // Data transfer recommendations
    if (report.totalDataTransferred > 5000) { // 5MB
      recommendations.push('Total data transfer is high - consider implementing lazy loading for non-critical images');
    }

    // Compression recommendations
    if (report.compressionSavings < 50) {
      recommendations.push('Increase compression levels to reduce file sizes further');
    }

    return recommendations;
  }

  /**
   * Get metrics for specific time period
   */
  getMetricsForPeriod(hours: number): ImageMetrics[] {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return this.metrics.filter(m => m.timestamp >= cutoff);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Export metrics as CSV
   */
  exportAsCSV(): string {
    const headers = [
      'URL',
      'Load Time (ms)',
      'File Size (KB)',
      'Format',
      'Width',
      'Height',
      'Compression Ratio',
      'Cache Hit',
      'Timestamp'
    ];

    const rows = this.metrics.map(m => [
      m.url,
      m.loadTime.toString(),
      (m.fileSize / 1024).toFixed(2),
      m.format,
      m.dimensions.width.toString(),
      m.dimensions.height.toString(),
      m.compressionRatio.toFixed(2),
      m.cacheHit.toString(),
      new Date(m.timestamp).toISOString()
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Get current metrics count
   */
  getMetricsCount(): number {
    return this.metrics.length;
  }
}

export const imageMetricsCollector = new ImageMetricsCollector();

/**
 * Utility to estimate image file size
 */
export function estimateImageSize(
  width: number,
  height: number,
  format: 'jpeg' | 'webp' | 'png',
  quality: number = 80
): number {
  const pixels = width * height;
  const baseSize = pixels * 3; // 3 bytes per pixel for RGB

  let compressionFactor: number;
  switch (format) {
    case 'jpeg':
      compressionFactor = 0.1 + (quality / 100) * 0.4; // 10-50% of base size
      break;
    case 'webp':
      compressionFactor = 0.07 + (quality / 100) * 0.3; // 7-37% of base size
      break;
    case 'png':
      compressionFactor = 0.3; // PNG compression is less predictable
      break;
    default:
      compressionFactor = 0.2;
  }

  return Math.round(baseSize * compressionFactor);
}

/**
 * Calculate compression ratio
 */
export function calculateCompressionRatio(
  originalSize: number,
  compressedSize: number
): number {
  return originalSize / compressedSize;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}