import { useNavigate } from "react-router-dom";
import OnBackButton from "../../../../../../components/UI/Buttons/OnBackButtons";
import styles from "./BookDetailsHeader.module.css";

export default function BookDetailsHeader({ name, authorName, userId, readState }) {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.backRow}>
        <OnBackButton onClick={() => navigate(-1)} className={styles.backOnHero} />
      </div>

      <h2 className={styles.bookTitle}>{name}</h2>
      
      <p
        onClick={() => navigate(`/author/${userId}`, { state: readState })}
        className={styles.authorText}
      >
        by {authorName}
      </p>
    </>
  );
}