import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * FONT OPTIMIZATION:
 * 
 * Next.js automatically:
 * - Downloads fonts at build time
 * - Self-hosts fonts (no external requests)
 * - Applies font-display: swap for better performance
 * - Generates CSS variables for use in components
 * 
 * CACHING: Fonts are served as static assets with immutable cache headers
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * METADATA CONFIGURATION
 * 
 * RENDERING: Generated at build time (Static)
 * 
 * SEO BENEFITS:
 * - title: Appears in browser tab and search results
 * - description: Meta description for search engines (160 chars recommended)
 * - keywords: Helps search engines understand page content
 * - authors: Identifies content creators
 * - openGraph: Social media preview cards (Twitter, Facebook, LinkedIn)
 * 
 * CACHING:
 * - Metadata is baked into static HTML at build time
 * - No runtime overhead
 * - Served with the same cache strategy as the page
 * 
 * This metadata is inherited by all pages unless overridden
 */
export const metadata: Metadata = {
  title: "ShopFlow - Premium E-commerce Platform",
  description: "Discover premium products at unbeatable prices. Your one-stop shop for everything you need.",
  keywords: ["e-commerce", "online shopping", "premium products", "shopflow"],
  authors: [{ name: "ShopFlow" }],
  openGraph: {
    title: "ShopFlow - Premium E-commerce Platform",
    description: "Discover premium products at unbeatable prices",
    type: "website",
  },
};

/**
 * ROOT LAYOUT COMPONENT
 * 
 * RENDERING TYPE: Static (Server Component)
 * ┌─────────────────────────────────────────────────────────────┐
 * │ This is the root layout for the entire application          │
 * │ - Wraps all pages in the app                                │
 * │ - Rendered once at build time                               │
 * │ - Shared across all routes (persistent)                     │
 * │ - Does NOT re-render on navigation                          │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * CACHING BEHAVIOR:
 * ✅ Layout HTML: Cached as part of static pages
 * ✅ Font Variables: Injected at build time (no runtime cost)
 * ✅ Global Styles: Bundled and cached as static assets
 * 
 * PERFORMANCE:
 * - Zero layout shift between pages
 * - Fonts preloaded and self-hosted
 * - No layout re-render on client navigation
 * 
 * CHILDREN:
 * - The {children} prop is the page content
 * - Different pages swap in/out but layout stays consistent
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
