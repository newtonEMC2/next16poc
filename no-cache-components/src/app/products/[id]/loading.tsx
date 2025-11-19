import styles from "./product-detail-loading.module.css";

/**
 * LOADING UI for Product Detail Page
 * 
 * Displays while individual product page is loading
 * Skeleton matches the actual product detail layout
 */
export default function ProductDetailLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb Skeleton */}
        <div className={styles.breadcrumbSkeleton}>
          <div className={styles.breadcrumbItem}></div>
          <div className={styles.breadcrumbItem}></div>
          <div className={styles.breadcrumbItem}></div>
        </div>

        {/* Product Layout Skeleton */}
        <div className={styles.productLayout}>
          {/* Image Section Skeleton */}
          <div className={styles.imageSection}>
            <div className={styles.mainImageSkeleton}></div>
            <div className={styles.thumbnails}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.thumbnailSkeleton}></div>
              ))}
            </div>
          </div>

          {/* Info Section Skeleton */}
          <div className={styles.infoSection}>
            <div className={styles.headerSkeleton}>
              <div className={styles.categorySkeleton}></div>
              <div className={styles.brandSkeleton}></div>
            </div>
            <div className={styles.titleSkeleton}></div>
            <div className={styles.ratingSkeleton}></div>
            <div className={styles.priceSectionSkeleton}></div>
            <div className={styles.stockSkeleton}></div>
            <div className={styles.descriptionSkeleton}>
              <div className={styles.lineSkeleton}></div>
              <div className={styles.lineSkeleton}></div>
              <div className={styles.lineSkeleton}></div>
            </div>
            <div className={styles.actionsSkeleton}>
              <div className={styles.buttonSkeleton}></div>
              <div className={styles.buttonSkeleton}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

