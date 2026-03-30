import React from "react";
import styles from "./StoreHero.module.css";
import { BookOpenIcon } from "../../UI/Icons/IconLibrary";

function StoreHero() {
  return (
    <div className={styles.hero}>
      <BookOpenIcon className={styles.heroIcon} />
      <h1 className={styles.heroTitle}>Unleash Your Reading Addiction</h1>
      <p className={styles.heroSubtitle}>
        Top up your wallet, unlock exclusive chapters, and never let a cliffhanger stop you. First chapters are always free!
      </p>
    </div>
  );
}

export default StoreHero;