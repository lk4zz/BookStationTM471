import React from "react";
import styles from "./FeaturesBreakdown.module.css";
import { LockedIcon, SparklesIcon } from "../../../../GlobalComponents/Icons/IconLibrary";

function FeaturesBreakdown() {
  return (
    <section className={styles.featuresContainer}>
      <h3 className={styles.featuresTitle}>What do your coins unlock?</h3>
      
      <div className={styles.featuresGrid}>
        {/* Dynamic Pricing Card */}
        <div className={styles.featureCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <LockedIcon className={styles.featureIcon} />
            </div>
            <h4 className={styles.featureCardTitle}>Dynamic Story Unlocks</h4>
          </div>
          <p className={styles.featureText}>
            Support authors fairly. Chapter pricing adapts naturally to the depth and scale of the story:
          </p>
          <ul className={styles.pricingList}>
            <li>
              <span className={styles.tierName}>Bite-Sized Scenes</span>
              <span className={styles.tierPrice}>~10 Coins</span>
            </li>
            <li>
              <span className={styles.tierName}>Immersive Chapters</span>
              <span className={styles.tierPrice}>20 - 35 Coins</span>
            </li>
            <li>
              <span className={styles.tierName}>Epic Milestones</span>
              <span className={styles.tierPrice}>50+ Coins</span>
            </li>
          </ul>
        </div>
        
        {/* Integrated AI Companion Card */}
        <div className={styles.featureCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapperFuture}>
              <SparklesIcon className={styles.featureIconFuture} />
            </div>
            <h4 className={styles.featureCardTitle}>AI Story Companion</h4>
          </div>
          <p className={styles.featureText}>
            Dive deeper into the lore. Use your coins to summon your personal AI companion to debate fan theories, summarize complex plot points, and explore alternate "what-ifs" with your favorite characters.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesBreakdown;