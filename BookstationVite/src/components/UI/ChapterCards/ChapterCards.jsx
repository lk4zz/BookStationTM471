import styles from "./ChapterCards.module.css";
import { LockedIcon, UnlockedIcon } from "../Icons/IconLibrary";



function ChapterCards({ chapter, className, onClick }) {

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

export default ChapterCards;