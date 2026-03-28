import React from "react";
import styles from "./CoinBundle.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { buyCoins } from "../../api/wallet";
import { CoinsIcon, SparklesIcon } from "../UI/IconLibrary";

function CoinBundle({ amount }) {
  const queryClient = useQueryClient();

  // Mutation to handle purchase and sync balance immediately
  const { mutate: handleBuy, isPending } = useMutation({
    mutationFn: () => buyCoins({ amount }), // matches req.body destructuring
    onSuccess: () => {
      queryClient.invalidateQueries(["wallet"]);
    },
  });

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
        onClick={() => handleBuy()}
        disabled={isPending}
      >
        {isPending ? "Processing..." : `$${price}`}
      </button>
    </div>
  );
}

export default CoinBundle;