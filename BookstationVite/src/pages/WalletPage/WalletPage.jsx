import { useNavigate } from "react-router-dom";
import { useWalletPage } from "./features/useWalletPage";
import styles from "./WalletPage.module.css";

// Adjust these paths depending on where you keep your components now
import WalletHeader from "./components/WalletHeader/WalletHeader";
import CoinBundleList from "./components/CoinBundleList/CoinBundleList";
import StoreHero from "./components/StoreHero/StoreHero";
import FeaturesBreakdown from "./components/FeaturesBreakdown/FeaturesBreakdown";

function WalletPage() {
  const {
    balance,
    isWalletLoading,
    walletError,
    standardBundles,
    premiumBundles,
  } = useWalletPage();
  const navigate = useNavigate();

  // --- Inline Loading State ---
  if (isWalletLoading) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  // --- Inline Error State ---
  if (walletError) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.errorText}>
          {walletError.message || "Failed to load wallet."}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <WalletHeader
        className={styles.walletHeader}
        balance={balance}
        navigate={navigate}
      />

      <main className={styles.mainContent}>

        <section className={styles.storeHero}>
          <StoreHero />
        </section>

        <section className={styles.bundles}>
          <CoinBundleList bundles={standardBundles} />

          <div className={styles.transitionSection}>
            <h2 className={styles.transitionTitle}>Need a bigger hoard?</h2>
            <p className={styles.transitionDesc}>
              Grab our best value bundles and binge without limits.
            </p>
          </div>

          <CoinBundleList bundles={premiumBundles} />
        </section>

        <section className={styles.features}>
          <FeaturesBreakdown />
        </section>
      </main>
    </div>
  );
}

export default WalletPage;