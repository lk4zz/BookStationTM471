import styles from "./LibraryErrorSection.module.css";

function LibraryErrorSection({ message }) {
  return (
    <main className={styles.centeredContent}>
      <div className="error">{message}</div>
    </main>
  );
}

export default LibraryErrorSection;
