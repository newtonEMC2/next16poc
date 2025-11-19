import Image from "next/image";
import Link from "next/link";
import styles from "./products.module.css";
import { Product, ProductsResponse } from "@/types/product";

/**
 * RENDERING STRATEGY: Incremental Static Regeneration (ISR)
 * 
 * This demonstrates Next.js 16 ISR with Cache Components:
 * 
 * 1. "use cache" + cacheLife():
 *    - Caches function results with custom revalidation
 *    - stale: 30min - serves stale while revalidating
 *    - revalidate: 30min - background revalidation interval
 *    - expire: 2h - absolute expiration
 * 
 * 2. ISR BEHAVIOR:
 *    - First 30 minutes: Serves cached result instantly
 *    - After 30 minutes: Serves stale + revalidates in background
 *    - After 2 hours: Forces fresh fetch
 * 
 * CACHING STRATEGY:
 * ┌─────────────────────────────────────────────────┐
 * │ Cache Life Configuration (ISR)                  │
 * │  stale: 30m → revalidate: 30m → expire: 2h     │
 * │  └─> Fast serving + regular updates             │
 * └─────────────────────────────────────────────────┘
 */

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

/**
 * Fetches all products with optional filters
 * ISR: Revalidates every 30 minutes using cacheLife()
 */
async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=100", {
      next: { revalidate: 1800 }, // ISR: Revalidate every 30 minutes
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
 * Fetches unique categories for filter dropdown
 * ISR: Cached with 30-minute revalidation
 */
async function getCategories(): Promise<string[]> {
  try {
    const res = await fetch("https://dummyjson.com/products/categories", {
      next: { revalidate: 1800 }, // ISR: Revalidate every 30 minutes
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await res.json();
    
    // Handle both array of strings and array of objects
    // dummyjson API returns array of objects: [{slug: "beauty", name: "Beauty", url: "..."}]
    if (Array.isArray(data) && data.length > 0) {
      if (typeof data[0] === "string") {
        return data;
      } else if (typeof data[0] === "object" && data[0].slug) {
        return data.map((cat: { slug: string }) => cat.slug);
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * COMPONENT: Products Catalog Page
 * 
 * RENDERING: SSG with ISR (5-minute revalidation)
 * FEATURES:
 * - Server-side filtering (no client JS needed)
 * - Category filtering
 * - Price range filtering
 * - Search functionality
 * - Grid layout with responsive design
 */
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const { category, search, minPrice, maxPrice } = params;

  // Fetch data (cached via "use cache")
  const [allProducts, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  // Server-side filtering
  let filteredProducts = allProducts;

  if (category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower)
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= parseFloat(minPrice)
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= parseFloat(maxPrice)
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Product Catalog</h1>
          <p className={styles.subtitle}>
            Browse our complete collection of premium products
          </p>
        </header>

        {/* Filters Section */}
        <aside className={styles.filters}>
          <form className={styles.filterForm}>
            {/* Search */}
            <div className={styles.filterGroup}>
              <label htmlFor="search" className={styles.filterLabel}>
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Search products..."
                defaultValue={search}
                className={styles.searchInput}
              />
            </div>

            {/* Category Filter */}
            <div className={styles.filterGroup}>
              <label htmlFor="category" className={styles.filterLabel}>
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue={category || ""}
                className={styles.select}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => {
                  const categoryStr = String(cat);
                  return (
                    <option key={categoryStr} value={categoryStr}>
                      {categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1)}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Price Range */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Price Range</label>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  defaultValue={minPrice}
                  className={styles.priceInput}
                  min="0"
                />
                <span className={styles.priceSeparator}>-</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  defaultValue={maxPrice}
                  className={styles.priceInput}
                  min="0"
                />
              </div>
            </div>

            <button type="submit" className={styles.applyBtn}>
              Apply Filters
            </button>
            
            <Link href="/products" className={styles.clearBtn}>
              Clear All
            </Link>
          </form>
        </aside>

        {/* Results Count */}
        <div className={styles.resultsBar}>
          <p className={styles.resultsCount}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyIcon}>🔍</p>
            <h2 className={styles.emptyTitle}>No products found</h2>
            <p className={styles.emptyText}>
              Try adjusting your filters or search terms
            </p>
            <Link href="/products" className={styles.emptyBtn}>
              View All Products
            </Link>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * COMPONENT: Product Card
 * 
 * Reusable product card component
 * This could be extracted to a separate component file
 * Note: Caching is handled at the page level via "use cache" on data fetching functions
 */
function ProductCard({ product }: { product: Product }) {
  return (
    <article>
      <Link href={`/products/${product.id}`} className={styles.productCard}>
        <div className={styles.imageWrapper}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={300}
            height={300}
            className={styles.productImage}
          />
          {product.discountPercentage > 0 && (
            <span className={styles.badge}>
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className={styles.lowStockBadge}>
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className={styles.outOfStockBadge}>Out of Stock</span>
          )}
        </div>

        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <span className={styles.category}>{product.category}</span>
            <span className={styles.brand}>{product.brand}</span>
          </div>

          <h3 className={styles.productTitle}>{product.title}</h3>
          
          <p className={styles.description}>
            {product.description.length > 80
              ? `${product.description.substring(0, 80)}...`
              : product.description}
          </p>

          <div className={styles.rating}>
            <span className={styles.stars}>★</span>
            <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
          </div>

          <div className={styles.cardFooter}>
            <div className={styles.priceWrapper}>
              <span className={styles.price}>${product.price}</span>
              {product.discountPercentage > 0 && (
                <span className={styles.originalPrice}>
                  ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

/**
 * METADATA: SEO optimization
 */
export const metadata = {
  title: "Products | ShopFlow",
  description: "Browse our complete catalog of premium products",
};

