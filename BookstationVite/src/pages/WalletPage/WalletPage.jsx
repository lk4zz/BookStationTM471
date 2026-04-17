import styles from "./WalletPage.module.css";
import WalletLoadingSection from "./sections/WalletLoadingSection/WalletLoadingSection";
import WalletErrorSection from "./sections/WalletErrorSection/WalletErrorSection";
import WalletMainSection from "./sections/WalletMainSection/WalletMainSection";
import { useWalletPage } from "./features/useWalletPage";
import { useNavigate } from "react-router-dom";
function WalletPage() {
  const {
    balance,
    isWalletLoading,
    walletError,
    standardBundles,
    premiumBundles,
  } = useWalletPage();
  const navigate = useNavigate();

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
      navigate={navigate}
    />
  );
}

export default WalletPage;
