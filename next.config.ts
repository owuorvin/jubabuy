import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for cPanel deployment
  output: 'export',
  
  // Add trailing slash to URLs
  trailingSlash: true,
  
  // Optimize images for static export
  images: {
    unoptimized: true,
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
  distDir: 'build',
};

export default nextConfig;