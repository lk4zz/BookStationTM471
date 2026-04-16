import { Link } from "react-router-dom";
import styles from "./WritingBookErrorSection.module.css";

function WritingBookErrorSection({ message }) {
  return (
    <div className={styles.page}>
      <p className={styles.centerMsg}>
        {message}{" "}
        <Link to="/writing" className={styles.backLink}>
          Back to writing
        </Link>
      </p>
    </div>
  );
}

export default WritingBookErrorSection;
