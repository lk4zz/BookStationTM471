import { useNavigate, useLocation } from "react-router-dom";
import { linkStateFromHere } from "../../../../../../utils/navigation";
import styles from "./DashBookCards.module.css";

function DraftBookCard({ book, onDelete }) {
  //book is passed down as map from draft section
  //books are passed down from main page to draft section
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <h3 className={styles.title}>{book.name}</h3>

        <p className={styles.meta}>
          Status: <span className={styles.status}>{book.status}</span>
        </p>

        <p className={styles.chapters}>
          {/* _count is the count return i made in in services */}
          {book._count?.chapters ?? 0} chapter
          {/* this is just to ensure right grammar (chapter(s)) */}
          {(book._count?.chapters ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>

      {/* buttons container could be turned into a component */}
      <div className={styles.actions}>
        {/* edit button */}
        <button
          type="button"
          className={styles.editBtn}
          onClick={() => navigate(`/writing/${book.id}`, { state: linkStateFromHere(location) })}
        >
          Edit
        </button>

        {/* delete button */}
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => onDelete(book.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default DraftBookCard;
