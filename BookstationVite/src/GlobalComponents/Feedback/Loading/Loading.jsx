import React from "react";
import styles from "./Loading.module.css";

//Loading animation logo component
export function Loading({ variant = "page", className }) {
  const rootClass =
    variant === "inline" ? styles.loaderContainerInline : styles.loaderContainer;

  return (
    <div
      className={[rootClass, className].filter(Boolean).join(" ")}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.logoPerspectiveWrapper}>
        <div className={`${styles.bDoor} ${styles.leftB}`}>
          <span>S</span>
        </div>
        <span className={styles.brandName}>BookStation</span>
        <div className={`${styles.bDoor} ${styles.rightB}`}>
          <span>B</span>
        </div>
      </div>
      <div className={styles.brandWrapper} />
    </div>
  );
}

export default Loading;
