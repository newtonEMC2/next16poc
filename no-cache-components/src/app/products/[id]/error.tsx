"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "../error.module.css";

/**
 * ERROR BOUNDARY for Product Detail Page
 * 
 * Catches errors that occur while loading or rendering product details
 * Provides user-friendly error UI with recovery options
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Product detail error:", error);
  }, [error]);

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h1 className={styles.errorTitle}>Failed to Load Product</h1>
        <p className={styles.errorMessage}>
          We encountered an error while loading this product.
          The product might be temporarily unavailable.
        </p>
        
        {error.message && (
          <details className={styles.errorDetails}>
            <summary className={styles.errorSummary}>
              Technical Details
            </summary>
            <code className={styles.errorCode}>{error.message}</code>
            {error.digest && (
              <p className={styles.errorDigest}>Error ID: {error.digest}</p>
            )}
          </details>
        )}

        <div className={styles.errorActions}>
          <button onClick={reset} className={styles.retryBtn}>
            Try Again
          </button>
          <Link href="/products" className={styles.homeBtn}>
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}

