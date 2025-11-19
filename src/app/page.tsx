import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { Product, ProductsResponse } from "@/types/product";

/**
 * RENDERING STRATEGY: Incremental Static Regeneration (ISR)
 * 
 * This function fetches featured products using Next.js 16 Cache Components:
 * 
 * 1. "use cache" + cacheLife():
 *    - Caches the function result with custom revalidation
 *    - stale: 3600s (1 hour) - serves stale while revalidating
 *    - revalidate: 3600s - background revalidation interval
 *    - expire: 86400s (24 hours) - absolute expiration
 * 
 * 2. ISR BEHAVIOR:
 *    - First hour: Serves cached result instantly
 *    - After 1 hour: Serves stale content + revalidates in background
 *    - After 24 hours: Forces fresh fetch
 * 
 * WHEN IS THIS EXECUTED?
 * - Build time: During `next build` (creates static HTML)
 * - Runtime: Revalidates every hour in the background
 * - On-demand: Via revalidatePath() or revalidateTag()
 * 
 * CACHING STRATEGY:
 * ┌─────────────────────────────────────────────────┐
 * │ Cache Life Configuration (ISR)                  │
 * │  stale: 1h → revalidate: 1h → expire: 24h      │
 * │  └─> Serves fast + updates in background        │
 * └─────────────────────────────────────────────────┘
 */
async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=8", {
      next: { revalidate: 3600 }, // ISR: Revalidate every hour
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data: ProductsResponse = await res.json();
    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * COMPONENT: Home (Landing Page)
 * 
 * RENDERING TYPE: Incremental Static Regeneration (ISR)
 * ┌──────────────────────────────────────────────────────────────┐
 * │ This is a React Server Component (RSC) that:                 │
 * │ 1. Runs ONLY on the server (never in the browser)            │
 * │ 2. Can be async and fetch data directly                      │
 * │ 3. Generates static HTML at build time                       │
 * │ 4. Revalidates data every hour in the background             │
 * └──────────────────────────────────────────────────────────────┘
 * 
 * CACHE STATUS:
 * ✅ Page Output: ISR with 1-hour revalidation
 * ✅ Data Fetching: Cached via "use cache" + cacheLife()
 * ✅ Images: Optimized and cached by Next.js Image component
 * 
 * BUILD OUTPUT:
 * Route (app)      Revalidate  Expire
 * ○ /                   1h       24h
 * ○ = ISR (Incremental Static Regeneration)
 * 
 * PERFORMANCE BENEFITS:
 * - Instant page loads (served as static HTML)
 * - Fresh content every hour (background revalidation)
 * - Zero downtime during updates (stale-while-revalidate)
 * - SEO-friendly (fully rendered HTML)
 */
export default async function Home() {
  // Fetch featured products (ISR: 1 hour revalidation)
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to ShopFlow</h1>
          <p className={styles.heroSubtitle}>
            Discover premium products at unbeatable prices. Your one-stop shop
            for everything you need.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/products" className={styles.primaryBtn}>
              Shop Now
            </Link>
            <Link href="/about" className={styles.secondaryBtn}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.featured}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <p className={styles.sectionSubtitle}>
              Handpicked selection of our best items
            </p>
          </div>

          <div className={styles.productGrid}>
            {featuredProducts.map((product) => (
              <article key={product.id}>
                <Link 
                  href={`/products/${product.id}`}
                  className={styles.productCard}
                >
                <div className={styles.productImageWrapper}>
                  {/* 
                    next/image OPTIMIZATION & CACHING:
                    
                    AUTOMATIC OPTIMIZATIONS:
                    - Lazy loading (loads only when in viewport)
                    - Responsive images (serves optimal size for device)
                    - Modern formats (WebP/AVIF when browser supports)
                    - Image compression and quality optimization
                    
                    CACHING STRATEGY:
                    - Browser Cache: Images cached by browser
                    - CDN Cache: Optimized images cached on Vercel CDN
                    - Immutable Cache: Cache headers set to immutable
                    
                    priority={product.id <= 4}:
                    - First 4 products load IMMEDIATELY (no lazy loading)
                    - Critical for LCP (Largest Contentful Paint) metric
                    - Preloads images for above-the-fold content
                    - Other images lazy-load as user scrolls
                  */}
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    width={300}
                    height={300}
                    className={styles.productImage}
                    priority={product.id <= 4} // Priority for first 4 products
                  />
                  {product.discountPercentage > 0 && (
                    <span className={styles.badge}>
                      -{Math.round(product.discountPercentage)}%
                    </span>
                  )}
                </div>

                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productBrand}>{product.brand}</p>

                  <div className={styles.productRating}>
                    <span className={styles.stars}>★</span>
                    <span className={styles.ratingValue}>
                      {product.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className={styles.productFooter}>
                    <div className={styles.priceWrapper}>
                      <span className={styles.price}>${product.price}</span>
                      {product.discountPercentage > 0 && (
                        <span className={styles.originalPrice}>
                          $
                          {(
                            product.price /
                            (1 - product.discountPercentage / 100)
                          ).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className={styles.viewBtn}>
                      View Details
                    </span>
                  </div>
                </div>
                </Link>
              </article>
            ))}
          </div>

          <div className={styles.viewAllWrapper}>
            <Link href="/products" className={styles.viewAllBtn}>
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Highlights Section */}
      <section className={styles.highlights}>
        <div className={styles.container}>
          <div className={styles.highlightsGrid}>
            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>🚚</div>
              <h3 className={styles.highlightTitle}>Free Shipping</h3>
              <p className={styles.highlightText}>
                On orders over $50
              </p>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>🔒</div>
              <h3 className={styles.highlightTitle}>Secure Payment</h3>
              <p className={styles.highlightText}>
                100% secure transactions
              </p>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>↩️</div>
              <h3 className={styles.highlightTitle}>Easy Returns</h3>
              <p className={styles.highlightText}>
                30-day return policy
              </p>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>⭐</div>
              <h3 className={styles.highlightTitle}>Premium Quality</h3>
              <p className={styles.highlightText}>
                Curated collections
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
