import styles from './streaming.module.css';

// Simulate slower API call for recommendations
async function fetchRecommended() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  
  return [
    { id: 1, name: 'Monitor Arm', price: 79.99 },
    { id: 2, name: 'Cable Organizer', price: 19.99 },
    { id: 3, name: 'Mouse Pad XL', price: 24.99 },
  ];
}

export async function RecommendedProducts() {
  const products = await fetchRecommended();
  const loadedAt = new Date().toLocaleTimeString();

  return (
    <div className={styles.recommendedList}>
      {products.map((product) => (
        <div key={product.id} className={styles.recommendedItem}>
          <strong>{product.name}</strong>
          <span>${product.price}</span>
        </div>
      ))}
      <p className={styles.loadTime}>Loaded at: {loadedAt}</p>
    </div>
  );
}

