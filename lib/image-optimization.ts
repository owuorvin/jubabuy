// lib/image-optimization.ts
export function getOptimizedImageUrl(url: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif';
  } = {}) {
    // If using Vercel's image optimization
    const params = new URLSearchParams();
    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.quality) params.set('q', options.quality.toString());
    if (options.format) params.set('fm', options.format);
    
    return `/_vercel/image?${params.toString()}&url=${encodeURIComponent(url)}`;
  }
  
  // For Next.js Image component optimization
  export function getImageDimensions(aspectRatio: string): { width: number; height: number } {
    const ratios: Record<string, { width: number; height: number }> = {
      '16:9': { width: 1920, height: 1080 },
      '4:3': { width: 1200, height: 900 },
      '1:1': { width: 1200, height: 1200 },
      '3:2': { width: 1200, height: 800 },
    };
    
    return ratios[aspectRatio] || { width: 1200, height: 800 };
  }
  
  // Generate responsive image sizes
  export function generateImageSizes(maxWidth: number): string {
    const breakpoints = [640, 768, 1024, 1280, 1536];
    return breakpoints
      .filter(bp => bp <= maxWidth)
      .map(bp => `(max-width: ${bp}px) ${bp}px`)
      .join(', ') + `, ${maxWidth}px`;
  }