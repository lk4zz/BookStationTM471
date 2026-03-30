import React from "react";
import styles from "./FeaturesBreakdown.module.css";
import { LockedIcon, SparklesIcon } from "../../UI/Icons/IconLibrary";

function FeaturesBreakdown() {
  return (
    <section className={styles.featuresContainer}>
      <h3 className={styles.featuresTitle}>What do your coins unlock?</h3>
      
      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <LockedIcon className={styles.featureIcon} />
          <h4 className={styles.featureCardTitle}>Fair Chapter Pricing</h4>
          <p className={styles.featureText}>Prices scale based on chapter length:</p>
          <ul className={styles.pricingList}>
            <li><strong>Quick Reads (&lt;500 words):</strong> Up to 10 Coins</li>
            <li><strong>Standard (500 - 2k words):</strong> 20 - 35 Coins</li>
            <li><strong>Epic Chapters (2k+ words):</strong> 50 - 70 Coins</li>
          </ul>
        </div>
        
        <div className={`${styles.featureCard} ${styles.futureFeature}`}>
          <div className={styles.cardHeader}>
            <SparklesIcon className={styles.featureIcon} />
            <span className={styles.badge}>Coming Soon</span>
          </div>
          <h4 className={styles.featureCardTitle}>AI Story Companion</h4>
          <p className={styles.featureText}>
            Unlock temporary AI access to discuss fan theories, summarize complex lore, and dive deeper into the story.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesBreakdown;