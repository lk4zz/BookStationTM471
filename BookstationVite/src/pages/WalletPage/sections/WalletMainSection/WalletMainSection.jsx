import WalletHeader from "./components/WalletHeader/WalletHeader";
import CoinBundleList from "./components/CoinBundleList/CoinBundleList";
import StoreHero from "./components/StoreHero/StoreHero";
import FeaturesBreakdown from "./components/FeaturesBreakdown/FeaturesBreakdown";
import styles from "./WalletMainSection.module.css";

function WalletMainSection({
  balance,
  standardBundles,
  premiumBundles,
  walletHeaderClassName,
}) {
  return (
    <div className={styles.pageContainer}>
      <WalletHeader className={walletHeaderClassName} balance={balance} />

      <main className={styles.mainContent}>
        <StoreHero />
        <CoinBundleList bundles={standardBundles} />

        <div className={styles.transitionSection}>
          <h2 className={styles.transitionTitle}>Need a bigger hoard?</h2>
          <p className={styles.transitionDesc}>
            Grab our best value bundles and binge without limits.
          </p>
        </div>

        <CoinBundleList bundles={premiumBundles} />

        <FeaturesBreakdown />
      </main>
    </div>
  );
}

export default WalletMainSection;
