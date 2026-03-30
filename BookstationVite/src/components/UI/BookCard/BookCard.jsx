import styles from "./BookCard.module.css";
import { Link } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_URL || "";
import { EyeIcon, StarIcon } from "../Icons/IconLibrary";
import { addView } from "../../../api/views";

function BookCard({ book }) {
  //link works but might as well change it to navigate later since i am already using it in other files
  return (
    <Link onClick= { () => addView(book.id)} className={styles.link} to={`/book/${book.id}`}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img
            src={`${BASE_URL}/${book.coverImage}`}
            alt={book.name}
            className={styles.cover}
          />
        </div>

        <div className={styles.details}>
          <h3 className={styles.title}>{book.name}</h3>
          <p className={styles.author}>{book.author?.name}</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.views}>
           <EyeIcon className={styles.eye}/> 
            <p>1233</p>
          </div>

          <div className={styles.rating}>
            <StarIcon className={styles.star} /> {book.ratingAverage || "0.0"}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
