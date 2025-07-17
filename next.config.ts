import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for cPanel deployment
  //output: 'export',
  
  // Add trailing slash to URLs
  trailingSlash: true,
  
  // Enhanced image optimization
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'ui-avatars.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  
  // Experimental performance features
  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
    webpackBuildWorker: true,
    turbopack: true,
    serverComponentsExternalPackages: ['@libsql/client'],
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer in development
    if (dev && !isServer) {
      config.optimization.usedExports = true;
    }
    
    // Production optimizations
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    return config;
  },
  
  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Disable ESLint during build (for quick deployment)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript errors during build (for quick deployment)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optional: Custom build directory
  //distDir: 'build',
};

export default nextConfig;