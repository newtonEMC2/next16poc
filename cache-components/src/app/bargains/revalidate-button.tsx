'use client';

import { useState } from 'react';
import styles from './revalidate-button.module.css';

export function RevalidateButton() {
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [message, setMessage] = useState('');

  const handleRevalidate = async () => {
    setIsRevalidating(true);
    setMessage('');

    try {
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: '/bargains' }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Prices updated!');
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRevalidating(false);
    }
  };

  return (
    <div className={styles.container}>
      <button
        onClick={handleRevalidate}
        disabled={isRevalidating}
        className={styles.button}
      >
        {isRevalidating ? 'Updating...' : '🔄 Update Prices'}
      </button>

      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}

      <p className={styles.info}>
        Click to refresh the page with latest pricing
      </p>
    </div>
  );
}

