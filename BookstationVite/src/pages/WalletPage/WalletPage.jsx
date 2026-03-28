import React from "react";
import styles from "./WalletPage.module.css";
import { useGetWallet } from "../../hooks/useWallet";
import WalletHeader from "../../components/WalletPageComp/WalletHeader";
import CoinBundleList from "../../components/WalletPageComp/CoinBundleList";
import StoreHero from "../../components/WalletPageComp/StoreHero";
import FeaturesBreakdown from "../../components/WalletPageComp/FeaturesBreakdown";

const VALID_COIN_BUNDLES = [100, 500, 1200, 2500, 5000];
const STANDARD_BUNDLES = VALID_COIN_BUNDLES.slice(0, 3);
const PREMIUM_BUNDLES = VALID_COIN_BUNDLES.slice(3);

function WalletPage() {
  const { balance, isWalletLoading, walletError } = useGetWallet();

  if (isWalletLoading) return <div className="loading">Loading...</div>;
  if (walletError) return <div className={styles.error}>Failed to load wallet.</div>;

  return (
    <div className={styles.pageContainer}>
      <WalletHeader className={styles.walletHeader} balance={balance} />
      
      <main className={styles.mainContent}>
        <StoreHero />
        <CoinBundleList bundles={STANDARD_BUNDLES} />

        <div className={styles.transitionSection}>
          <h2 className={styles.transitionTitle}>Need a bigger hoard?</h2>
          <p className={styles.transitionDesc}>Grab our best value bundles and binge without limits.</p>
        </div>
        
        <CoinBundleList bundles={PREMIUM_BUNDLES} />
        
        <FeaturesBreakdown />
      </main>
    </div>
  );
}

export default WalletPage;