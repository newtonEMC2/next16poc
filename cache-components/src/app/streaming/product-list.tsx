import { cacheLife } from 'next/cache';
import styles from './streaming.module.css';

// Simulate API call to fetch products
async function fetchProducts() {
  
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  return [
    { id: 1, name: 'Wireless Mouse', price: 29.99, stock: 15 },
    { id: 2, name: 'Mechanical Keyboard', price: 89.99, stock: 8 },
    { id: 3, name: 'USB-C Hub', price: 45.99, stock: 23 },
    { id: 4, name: 'Laptop Stand', price: 39.99, stock: 12 },
    { id: 5, name: 'Webcam HD', price: 59.99, stock: 5 },
    { id: 6, name: 'Desk Lamp', price: 34.99, stock: 18 },
  ];
}

export async function ProductList() {
  "use cache";
  // cacheLife({stale: 30, revalidate: 60, expire: 300});

  cacheLife({ stale: 60, revalidate: 90, expire: 120 })

  const products = await fetchProducts();
  const loadedAt = new Date().toLocaleTimeString();

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <div key={product.id} className={styles.productCard}>
          <h3>{product.name}</h3>
          <p className={styles.price}>${product.price}</p>
          <p className={styles.stock}>{product.stock} in stock</p>
        </div>
      ))}
      <p className={styles.loadTime}>Loaded at: {loadedAt}</p>
    </div>
  );
}

