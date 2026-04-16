import styles from "./WalletErrorSection.module.css";

function WalletErrorSection({ message }) {
  return <div className={styles.error}>{message}</div>;
}

export default WalletErrorSection;
