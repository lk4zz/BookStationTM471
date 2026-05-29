import React, { useState } from 'react';
import { useApplicationStatus } from '../../../../hooks/UserHooks/useApplyAuthor';
import AuthorApplicationView from './AuthorApplicationView/AuthorApplicationView';
import { CoinsIcon, BookOpenIcon, SparklesIcon } from '../../../../GlobalComponents/Icons/IconLibrary';
import styles from './AuthorLandingPage.module.css';

const AuthorLandingPage = ({ currentUser }) => {
  const { data: statusData, isLoading: isStatusLoading } = useApplicationStatus();
  const [showModal, setShowModal] = useState(false);

  if (isStatusLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const isApplied = statusData?.status && statusData.status !== 'NOT_SUBMITTED';

  return (
    <div className={styles.landingContainer}>
      <header className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Join the BookStation Author Community</h1>
        <p className={styles.heroSubtitle}>
          Turn your imagination into reality. Share your stories with thousands of readers and get rewarded for
          your creativity.
        </p>

        <button className={styles.ctaButton} onClick={() => setShowModal(true)}>
          {isApplied ? "View Application Status" : "Apply to be an Author"}
        </button>
      </header>

      <div className={styles.featuresSection}>
        <div className={styles.featureCard}>
          <CoinsIcon className={styles.featureIcon} aria-hidden="true" />
          <h3 className={styles.featureTitle}>Earn Coins</h3>
          <p className={styles.featureDesc}>Monetize your work. Sell premium chapters and earn coins from your readers.</p>
        </div>

        <div className={styles.featureCard}>
          <BookOpenIcon className={styles.featureIcon} aria-hidden="true" />
          <h3 className={styles.featureTitle}>Build an Audience</h3>
          <p className={styles.featureDesc}>Grow your following. Engage through comments and build a loyal fanbase.</p>
        </div>

        <div className={styles.featureCard}>
          <SparklesIcon className={styles.featureIcon} aria-hidden="true" />
          <h3 className={styles.featureTitle}>Powerful Dashboard</h3>
          <p className={styles.featureDesc}>Track analytics, manage chapters, and review feedback in one workspace.</p>
        </div>
      </div>

      {showModal && (
        <AuthorApplicationView 
          currentUser={currentUser} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default AuthorLandingPage;
