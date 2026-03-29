import React from "react";
import styles from "./CoinBundle.module.css";
import { CoinsIcon, SparklesIcon } from "../UI/IconLibrary";
import { useBuyCoins } from "../../hooks/useWallet";

function CoinBundle({ amount }) {
const { mutate: handleBuy, isPending } = useBuyCoins();

  // Calculate mock fiat price (e.g., $0.99 per 100 coins)
  const price = ((amount / 100) * 0.99).toFixed(2);
  const isPremium = amount >= 2500;

  return (
    <div className={`${styles.coinBundle} ${isPremium ? styles.premiumBundle : ""}`}>
      {isPremium && <SparklesIcon className={styles.sparkleIcon} />}
      
      <div className={styles.iconContainer}>
        <CoinsIcon className={styles.bundleIcon} />
      </div>
      
      <h3 className={styles.coinAmount}>{amount} Coins</h3>
      
      <button 
        className={styles.buyButton} 
        onClick={() => handleBuy({amount})}
        disabled={useBuyCoins.isPending}
      >
        {isPending ? "Processing..." : `$${price}`}
      </button>
    </div>
  );
}

export default CoinBundle;