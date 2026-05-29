import AuthorCard from "../AuthorCard/AuthorCard";
import styles from "./AuthorGrid.module.css";

//the author grid to list the author card
function AuthorGrid({ authors }) {
  if (!authors || authors.length === 0) return null;

  return (
    <div className={styles.grid}>
      {authors.map((author) => (
        // the author card component being mapped
        <AuthorCard key={author.id} author={author} />
      ))}
    </div>
  );
}

export default AuthorGrid;