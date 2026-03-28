import styles from "./BookChapter.module.css";
import { LockedIcon, UnlockedIcon } from "../UI/IconLibrary";
import { useNavigate } from "react-router-dom";
import { use } from "react";

function BookChapters({ chapter }) {
  //fix icons add them to icon library
   const navigate =  useNavigate()
   const handleOnClick = () => {
    if(chapter.hasAccess) {
      navigate(`/book/reading/${chapter.bookId}/${chapter.id}`); }
    else {alert("nigga you dont have access")}
   }
  console.log(chapter)
  return (
    <div 
     onClick={handleOnClick}
     className={styles.chapterCard}>
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