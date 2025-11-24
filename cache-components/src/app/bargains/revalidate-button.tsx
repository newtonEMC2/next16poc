'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './revalidate-button.module.css';
import { revalidateBargains } from './actions';

export function RevalidateButton({expire = false}: {expire?: boolean}) {
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [message, setMessage] = useState('');

  const handleRevalidate = async () => {
    setIsRevalidating(true);
    setMessage('');

    try {
      await revalidateBargains(expire);
      if (expire) {
        setMessage('✅ Cache expired! Refreshing...');
        // router.refresh();
      } else {
        setMessage('✅ Cache marked for update on next visit!');
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
        {isRevalidating ? 'Updating...' : `🔄 Update Prices${expire ? ' (Expire)' : ''}`}
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

