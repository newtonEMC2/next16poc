import styles from "./loading.module.css";

/**
 * LOADING UI for Products Listing Page
 * 
 * This component displays while the products page is loading
 * 
 * FEATURES:
 * - Instant feedback to users
 * - Skeleton UI matching actual layout
 * - Smooth transition to actual content
 * - Shows during Suspense boundaries
 * 
 * WHEN SHOWN:
 * - Initial page load
 * - Navigation from other pages
 * - While data is being fetched
 */
export default function ProductsLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header Skeleton */}
        <div className={styles.headerSkeleton}>
          <div className={styles.titleSkeleton}></div>
          <div className={styles.subtitleSkeleton}></div>
        </div>

        {/* Filters Skeleton */}
        <div className={styles.filtersSkeleton}>
          <div className={styles.filterItemSkeleton}></div>
          <div className={styles.filterItemSkeleton}></div>
          <div className={styles.filterItemSkeleton}></div>
          <div className={styles.filterItemSkeleton}></div>
        </div>

        {/* Results Bar Skeleton */}
        <div className={styles.resultsBarSkeleton}></div>

        {/* Product Grid Skeleton */}
        <div className={styles.gridSkeleton}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={styles.cardSkeleton}>
              <div className={styles.imageSkeleton}></div>
              <div className={styles.contentSkeleton}>
                <div className={styles.lineSkeleton}></div>
                <div className={styles.lineSkeleton}></div>
                <div className={styles.lineSkeletonShort}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

