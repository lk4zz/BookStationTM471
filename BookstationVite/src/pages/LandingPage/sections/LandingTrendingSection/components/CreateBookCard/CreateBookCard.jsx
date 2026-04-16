import { useNavigate } from "react-router-dom";
import styles from "./CreateBookCard.module.css";

function CreateBookCard() {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/signup")}
      className={styles.createCard}
    >
      <div className={styles.plus}>＋</div>
      <h3>YOUR OWN STORY</h3>
      <p>Tell the world your story.</p>
    </div>
  );
}

export default CreateBookCard;
