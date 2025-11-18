import Image from "next/image";
import styles from "./page.module.css";
import { Product, ProductsResponse } from "@/types/product";

/**
 * RENDERING STRATEGY: Static Site Generation (SSG)
 * 
 * This function fetches featured products and demonstrates Next.js 16 caching:
 * 
 * 1. "use cache" directive (Next.js 16 cacheComponents feature):
 *    - Tells Next.js to cache the RESULT of this function
 *    - The cached result is shared across all requests
 *    - Default cache duration: 15 minutes (900 seconds)
 *    - Can be customized with: "use cache" { revalidate: 3600 }
 * 
 * 2. fetch() with cache: "force-cache":
 *    - Caches the HTTP response from the API
 *    - Response is stored in Next.js Data Cache
 *    - Persists across deployments and requests
 * 
 * WHEN IS THIS EXECUTED?
 * - Build time: During `next build` (creates static HTML)
 * - Revalidation: After cache expires (15m default)
 * - On-demand: Via revalidatePath() or revalidateTag()
 * 
 * CACHING LAYERS:
 * ┌─────────────────────────────────────────────────┐
 * │ 1. Component Cache ("use cache")                │ ← Function result cached
 * │    └─> Caches the products array for 15m        │
 * └─────────────────────────────────────────────────┘
 * ┌─────────────────────────────────────────────────┐
 * │ 2. Data Cache (fetch cache: "force-cache")      │ ← HTTP response cached
 * │    └─> Caches API response indefinitely          │
 * └─────────────────────────────────────────────────┘
 */
async function getFeaturedProducts(): Promise<Product[]> {
  "use cache"; // Next.js 16: Cache this function's result for 15 minutes
  
  try {
    const res = await fetch("https://dummyjson.com/products?limit=8", {
      cache: "force-cache", // Cache the HTTP response indefinitely
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
 * RENDERING TYPE: Static (SSG)
 * ┌──────────────────────────────────────────────────────────────┐
 * │ This is a React Server Component (RSC) that:                 │
 * │ 1. Runs ONLY on the server (never in the browser)            │
 * │ 2. Can be async and fetch data directly                      │
 * │ 3. Generates static HTML at build time                       │
 * │ 4. No client-side JavaScript needed (zero JS bundle)         │
 * └──────────────────────────────────────────────────────────────┘
 * 
 * CACHE STATUS:
 * ✅ Page Output: Cached as static HTML (15 minute revalidation)
 * ✅ Data Fetching: Cached via "use cache" directive
 * ✅ Images: Optimized and cached by Next.js Image component
 * 
 * BUILD OUTPUT:
 * Route (app)      Revalidate  Expire
 * ○ /                   15m      1y
 * ○ = Static (pre-rendered at build time)
 * 
 * PERFORMANCE BENEFITS:
 * - Zero server load for cached pages
 * - Instant page loads (served as static HTML)
 * - SEO-friendly (fully rendered HTML)
 * - Low bandwidth usage
 */
export default async function Home() {
  // Fetch featured products (cached for 15 minutes via "use cache")
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
            <button className={styles.primaryBtn}>
              Shop Now
            </button>
            <button className={styles.secondaryBtn}>
              Learn More
            </button>
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
              <article key={product.id} className={styles.productCard}>
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
                    <button className={styles.viewBtn}>
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.viewAllWrapper}>
            <button className={styles.viewAllBtn}>
              View All Products →
            </button>
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
