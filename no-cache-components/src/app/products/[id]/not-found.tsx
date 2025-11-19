import Link from "next/link";
import styles from "./not-found.module.css";

/**
 * NOT FOUND PAGE for Product Detail
 * 
 * Displayed when:
 * - Product ID doesn't exist
 * - Product has been deleted
 * - Invalid product ID format
 * 
 * Triggered by calling notFound() in the page component
 */
export default function ProductNotFound() {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundIcon}>🔍</div>
        <h1 className={styles.notFoundTitle}>Product Not Found</h1>
        <p className={styles.notFoundMessage}>
          Sorry, we couldn't find the product you're looking for.
          It may have been removed or is temporarily unavailable.
        </p>
        
        <div className={styles.suggestions}>
          <p className={styles.suggestionsTitle}>Here's what you can do:</p>
          <ul className={styles.suggestionsList}>
            <li>Check the product URL for typos</li>
            <li>Browse our product catalog</li>
            <li>Search for similar products</li>
            <li>Return to the homepage</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Link href="/products" className={styles.catalogBtn}>
            Browse Products
          </Link>
          <Link href="/" className={styles.homeBtn}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

