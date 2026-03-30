import styles from "../../../pages/WritingBookPage/WritingBookPage.module.css";
import OnBackButton from "../../UI/Buttons/OnBackButtons";
import { Link } from "react-router-dom";

const STATUS_OPTIONS = ["ONGOING", "COMPLETED"];

function Toolbar({ book, statusError, onStatusChange, isStatusPending }) {
  return (
    <>
      <header className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Link to="/writing" className={styles.back}>
            <OnBackButton />
          </Link>
          <h1 className={styles.bookTitle}>{book.name}</h1>
        </div>

        <div className={styles.toolbarRight}>
          <label className={styles.statusLabel}>
            Book status
            <select
              className={styles.statusSelect}
              value={book.status}
              onChange={onStatusChange}
              disabled={isStatusPending}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      {statusError && <p className={styles.statusErr}>{statusError}</p>}
    </>
  );
}

export default Toolbar;