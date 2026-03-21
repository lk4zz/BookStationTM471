import styles from "./BookDescription.module.css";

function BookDescription({ book }) {
  return (
    <div className={styles.descblock}>
      <div>
        <p className={styles.title}>Book Description</p>
        <p className={styles.bookdesc}>{book.description}</p>
      </div>
      <div className={styles.progressContainer}>
        <p className={styles.title}>Book Progress</p>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: "60%" }}></div>
        </div>
      </div>
    </div>
  );
}

export default BookDescription;
