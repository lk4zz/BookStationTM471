import styles from "./WalletPage.module.css";
import WalletLoadingSection from "./sections/WalletLoadingSection/WalletLoadingSection";
import WalletErrorSection from "./sections/WalletErrorSection/WalletErrorSection";
import WalletMainSection from "./sections/WalletMainSection/WalletMainSection";
import { useWalletPage } from "./features/useWalletPage";

function WalletPage() {
  const {
    balance,
    isWalletLoading,
    walletError,
    standardBundles,
    premiumBundles,
  } = useWalletPage();

  if (isWalletLoading) return <WalletLoadingSection />;
  if (walletError)
    return (
      <WalletErrorSection
        message={walletError.message || "Failed to load wallet."}
      />
    );

  return (
    <WalletMainSection
      balance={balance}
      standardBundles={standardBundles}
      premiumBundles={premiumBundles}
      walletHeaderClassName={styles.walletHeader}
    />
  );
}

export default WalletPage;
