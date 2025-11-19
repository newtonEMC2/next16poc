import type { Metadata } from 'next';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company and mission',
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About Us</h1>
      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Our Mission</h2>
          <p>
            We are dedicated to building exceptional web experiences that make a
            difference in people's lives.
          </p>
        </section>
        
        <section className={styles.section}>
          <h2>Our Story</h2>
          <p>
            Founded with a passion for innovation and excellence, we strive to
            deliver cutting-edge solutions that exceed expectations.
          </p>
        </section>
        
        <section className={styles.section}>
          <h2>Our Values</h2>
          <ul className={styles.list}>
            <li>Innovation and creativity</li>
            <li>Quality and excellence</li>
            <li>Customer satisfaction</li>
            <li>Continuous improvement</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
