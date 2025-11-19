import { ReactNode } from "react";
import styles from "./products-layout.module.css";

/**
 * NESTED LAYOUT for Products Section
 * 
 * This layout wraps all routes under /products/*
 * Including:
 * - /products (listing page)
 * - /products/[id] (detail pages)
 * 
 * FEATURES:
 * - Consistent navigation and header
 * - Shared styles across product pages
 * - Layout component is cached and reused
 * - Does not re-render when navigating between products
 * 
 * CACHING:
 * - Layout is static and cached
 * - Only page content changes between routes
 * - Optimal performance with minimal re-renders
 */

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.productsLayout}>
      {/* Optional: Shared header or navigation for products section */}
      {children}
    </div>
  );
}

/**
 * METADATA for Products Section
 * 
 * This metadata is inherited by all child routes
 * Child routes can override specific fields
 */
export const metadata = {
  title: "Products | ShopFlow",
  description: "Browse our premium collection of products",
};

