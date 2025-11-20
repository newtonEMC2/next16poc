import { RevalidateButton } from './revalidate-button';
import styles from './bargains.module.css';

export default async function PriceListPage() {
  // This timestamp is captured at build time (SSG)
  "use cache";
  const buildTime = new Date().toLocaleString();
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Today&apos;s Special Prices</h1>
      
      <div className={styles.priceCard}>
        <h2>Featured Products</h2>
        <div className={styles.priceList}>
          <div className={styles.priceItem}>
            <span>Premium Laptop</span>
            <span className={styles.price}>$999</span>
          </div>
          <div className={styles.priceItem}>
            <span>Wireless Headphones</span>
            <span className={styles.price}>$149</span>
          </div>
          <div className={styles.priceItem}>
            <span>Smart Watch</span>
            <span className={styles.price}>$299</span>
          </div>
        </div>
        <p className={styles.updateTime}>Last updated: {buildTime}</p>
      </div>

      <RevalidateButton />
    </div>
  );
}

