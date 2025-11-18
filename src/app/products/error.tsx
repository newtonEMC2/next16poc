"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./error.module.css";

/**
 * ERROR BOUNDARY for Products Listing Page
 * 
 * This component catches errors that occur during:
 * - Data fetching
 * - Component rendering
 * - Client-side operations
 * 
 * FEATURES:
 * - User-friendly error messages
 * - Retry functionality
 * - Navigation back to safety
 * - Automatic error logging
 * 
 * NOTE: Must be a Client Component ("use client")
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Products page error:", error);
  }, [error]);

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h1 className={styles.errorTitle}>Oops! Something went wrong</h1>
        <p className={styles.errorMessage}>
          We encountered an error while loading the products page.
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
          <Link href="/" className={styles.homeBtn}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

