import styles from "./BookChapter.module.css";
import { LockedIcon, UnlockedIcon } from "../../UI/Icons/IconLibrary";
import { useNavigate } from "react-router-dom";
import { use } from "react";

function BookChapters({ chapter, className, onClick }) {

  return (
    <div 
     onClick={onClick}
     className={`${styles.chapterCard} ${className} ` }>
      <span className={styles.chapterTitle}>
        {chapter.chapterNum}. {chapter.title}
      </span>
      
      {chapter.hasAccess ? (
        <UnlockedIcon className={styles.icon}/>
      ) : (
        <LockedIcon className={styles.icon} />
      )}
    </div>
  );
}

export default BookChapters;