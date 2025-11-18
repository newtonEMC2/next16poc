import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./product-detail.module.css";
import { Product } from "@/types/product";
import { Suspense } from "react";
import { unstable_noStore } from "next/cache";

/**
 * RENDERING STRATEGY: Partial Prerendering (PPR) + ISR
 * 
 * This page demonstrates Next.js 16 hybrid rendering:
 * 
 * 1. STATIC SECTIONS (Cached with ISR):
 *    - Product details, images, description
 *    - Related products
 *    - Revalidates every 1 hour
 * 
 * 2. DYNAMIC SECTIONS (Generated on every request):
 *    - Current timestamp (DynamicTime component)
 *    - Uses unstable_noStore() to opt-out of caching
 *    - Wrapped in Suspense for streaming
 * 
 * BUILD BEHAVIOR:
 * - Build time: Generates static HTML (2 products pre-generated)
 * - Runtime: Serves static content + streams dynamic sections
 * - After 1 hour: ISR revalidates static content in background
 * 
 * PERFORMANCE:
 * - Instant page loads (static shell)
 * - Dynamic sections stream in
 * - SEO-friendly (fully rendered)
 */

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Dynamic Time Component
 * This component is NOT cached and updates on every request
 * Demonstrates Partial Prerendering: static page + dynamic sections
 */
async function DynamicTime() {
  // Force dynamic rendering - this component will never be cached
  unstable_noStore();
  
  const currentTime = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  });
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '12px 20px',
      borderRadius: '8px',
      marginBottom: '20px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}>
      🕐 Page generated at: <strong>{currentTime}</strong>
      <span style={{ 
        marginLeft: '10px', 
        fontSize: '12px', 
        opacity: 0.9 
      }}>
        (Dynamic - updates on every refresh)
      </span>
    </div>
  );
}

/**
 * Fetches a single product by ID
 * ISR: Cached with 1-hour revalidation
 */
async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      next: { revalidate: 3600 }, // ISR: Revalidate every hour
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch product");
    }

    const product: Product = await res.json();
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

/**
 * Fetches related products from the same category
 * ISR: Cached with 1-hour revalidation
 */
async function getRelatedProducts(
  category: string,
  currentId: number,
  limit: number = 4
): Promise<Product[]> {
  try {
    const res = await fetch(
      `https://dummyjson.com/products/category/${category}?limit=10`,
      {
        next: { revalidate: 3600 }, // ISR: Revalidate every hour
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch related products");
    }

    const data = await res.json();
    return data.products
      .filter((p: Product) => p.id !== currentId)
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

/**
 * COMPONENT: Product Detail Page
 * 
 * Features:
 * - Image gallery with main image
 * - Product information (title, price, description)
 * - Stock status indicator
 * - Add to cart functionality (UI only)
 * - Related products section
 * - Breadcrumb navigation
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  
  const product = await getProduct(id);

  // If product doesn't exist, show 404
  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await getRelatedProducts(product.category, product.id);

  const discountedPrice = product.discountPercentage > 0
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/products" className={styles.breadcrumbLink}>
            Products
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{product.title}</span>
        </nav>

        {/* Dynamic Time - Updates on every refresh */}
        <Suspense fallback={
          <div style={{
            background: '#f3f4f6',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            Loading time...
          </div>
        }>
          <DynamicTime />
        </Suspense>

        {/* Product Details */}
        <div className={styles.productLayout}>
          {/* Image Gallery */}
          <div className={styles.imageSection}>
            <div className={styles.mainImageWrapper}>
              <Image
                src={product.images[0] || product.thumbnail}
                alt={product.title}
                width={600}
                height={600}
                className={styles.mainImage}
                priority
              />
              {product.discountPercentage > 0 && (
                <span className={styles.badge}>
                  -{Math.round(product.discountPercentage)}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.slice(0, 5).map((image, index) => (
                  <div key={index} className={styles.thumbnailWrapper}>
                    <Image
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                      width={100}
                      height={100}
                      className={styles.thumbnail}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={styles.infoSection}>
            <div className={styles.header}>
              <span className={styles.category}>{product.category}</span>
              <span className={styles.brand}>{product.brand}</span>
            </div>

            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.rating}>
              <span className={styles.stars}>★★★★★</span>
              <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
              <span className={styles.reviewCount}>(127 reviews)</span>
            </div>

            {/* Price */}
            <div className={styles.priceSection}>
              <div className={styles.priceWrapper}>
                <span className={styles.currentPrice}>${product.price}</span>
                {discountedPrice && (
                  <span className={styles.originalPrice}>
                    ${discountedPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.discountPercentage > 0 && (
                <span className={styles.savings}>
                  You save ${(discountedPrice! - product.price).toFixed(2)} (
                  {Math.round(product.discountPercentage)}%)
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className={styles.stockSection}>
              {product.stock > 10 ? (
                <span className={styles.inStock}>✓ In Stock</span>
              ) : product.stock > 0 ? (
                <span className={styles.lowStock}>
                  ⚠️ Only {product.stock} left in stock
                </span>
              ) : (
                <span className={styles.outOfStock}>✗ Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className={styles.description}>
              <h2 className={styles.sectionTitle}>Description</h2>
              <p className={styles.descriptionText}>{product.description}</p>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                className={styles.addToCartBtn}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button className={styles.wishlistBtn}>♡ Add to Wishlist</button>
            </div>

            {/* Additional Info */}
            <div className={styles.additionalInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>🚚</span>
                <div>
                  <p className={styles.infoTitle}>Free Shipping</p>
                  <p className={styles.infoText}>On orders over $50</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>↩️</span>
                <div>
                  <p className={styles.infoTitle}>Easy Returns</p>
                  <p className={styles.infoText}>30-day return policy</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>🔒</span>
                <div>
                  <p className={styles.infoTitle}>Secure Payment</p>
                  <p className={styles.infoText}>100% secure transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Related Products</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImageWrapper}>
                    <Image
                      src={relatedProduct.thumbnail}
                      alt={relatedProduct.title}
                      width={200}
                      height={200}
                      className={styles.relatedImage}
                    />
                  </div>
                  <h3 className={styles.relatedProductTitle}>
                    {relatedProduct.title}
                  </h3>
                  <p className={styles.relatedPrice}>${relatedProduct.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/**
 * STATIC PARAMS GENERATION
 * 
 * Pre-generates only the first 2 product pages at build time
 * Other pages will be generated on-demand (ISR)
 * 
 * STRATEGY:
 * - Build time: Generate 2 most important products
 * - On-demand: Other products generated when first visited
 * - ISR: All pages revalidate every 1 hour
 */
export async function generateStaticParams() {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=2");
    const data = await res.json();

    return data.products.map((product: Product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

/**
 * METADATA GENERATION
 * 
 * Generates dynamic SEO metadata for each product
 */
export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found | ShopFlow",
      description: "The product you're looking for doesn't exist.",
    };
  }

  return {
    title: `${product.title} | ShopFlow`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.thumbnail],
    },
  };
}

