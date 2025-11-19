import type { NextConfig } from "next";

/**
 * NEXT.JS 16 CONFIGURATION
 * 
 * This file configures Next.js build-time and runtime behavior
 */
const nextConfig: NextConfig = {
  /**
   * reactCompiler: true
   * 
   * Enables the React Compiler (React 19+)
   * - Automatically optimizes React components
   * - Memoizes components and hooks automatically
   * - Reduces need for useMemo, useCallback, React.memo
   * - Better performance with less manual optimization
   * 
   * Build Impact: Slightly longer build times, faster runtime
   */
  reactCompiler: true,

  /**
   * cacheComponents: false (Temporarily disabled)
   * 
   * Disabled due to compatibility issues with dynamic ISR pages
   * Using standard fetch caching with next: { revalidate } instead
   * 
   * This resolves hydration errors on dynamically generated pages
   */
  cacheComponents: false,

  /**
   * images.remotePatterns
   * 
   * Configures which external image domains are allowed
   * Required for next/image to optimize external images
   * 
   * SECURITY: Prevents arbitrary image URLs from being optimized
   * PERFORMANCE: Enables automatic image optimization for these domains
   * 
   * Image Optimization includes:
   * - Format conversion (WebP/AVIF)
   * - Responsive sizing
   * - Quality compression
   * - Lazy loading
   * 
   * CACHING:
   * - Optimized images cached on CDN (Vercel)
   * - Browser cache: ~1 year
   * - Immutable cache headers
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dummyjson.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
