import React from "react";
import styles from "./WalletHeader.module.css";
import OnBackButton from "../../../../../../components/UI/Buttons/OnBackButtons";
import { WalletIcon, CoinsIcon } from "../../../../../../components/UI/Icons/IconLibrary";

function WalletHeader({ balance }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <OnBackButton fallbackPath="/explore" />
        <h1 className={styles.title}>Store</h1>
      </div>
      
      <div className={styles.balanceBadge}>
        <span className={styles.balanceAmount}>{balance}</span>
        <CoinsIcon className={styles.coinIcon} />
      </div>
    </header>
  );
}

export default WalletHeader;