import React from "react";
import styles from "./CoinBundleList.module.css";
import CoinBundle from "./CoinBundle";

function CoinBundleList({ bundles }) {
  return (
    <div className={styles.bundlesFlex}>
      {bundles.map((amount) => (
        <CoinBundle key={amount} amount={amount} />
      ))}
    </div>
  );
}

export default CoinBundleList;