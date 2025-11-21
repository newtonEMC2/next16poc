import { Suspense } from 'react';
import { ProductList } from './product-list';
import { RecommendedProducts } from './recommended-products';
import styles from './streaming.module.css';

// Force dynamic rendering to enable streaming
export default function StreamingPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Product Catalog</h1>

      <div className={styles.main}>
        <Suspense fallback={<ProductSkeleton />}>
          <ProductList />
        </Suspense>
      </div>

      <aside className={styles.sidebar}>
        <h2>You might also like</h2>
        <Suspense fallback={<SidebarSkeleton />}>
          <RecommendedProducts />
        </Suspense>
      </aside>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className={styles.grid}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonText} />
          <div className={styles.skeletonText} style={{ width: '60%' }} />
        </div>
      ))}
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className={styles.skeletonList}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={styles.skeletonItem}>
          <div className={styles.skeletonThumb} />
          <div className={styles.skeletonText} />
        </div>
      ))}
    </div>
  );
}

