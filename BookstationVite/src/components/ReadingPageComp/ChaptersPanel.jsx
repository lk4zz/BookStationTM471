import BookChapters from "../bookdetailscomp/BookChapters";
import styles from "./ChaptersPanel.module.css";
import OnBackButton from "../UI/OnBackButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ModelUnlock from "./ModelUnlock";
import { useUnlockChapter } from "../../hooks/useChapters";
import LoginModel from "../UI/LoginWindowModel/LoginModel";
import { checkIfGuest } from "../../utils/checkIfGuest";


function ChaptersPanel({ chapter, chapters, isChapterLoading }) {
  const [OpenUnlock, setOpenUnlock] = useState(false)
  const [OpenLogIn, setOpenLogIn] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState(null);
  const navigate = useNavigate()
  const { mutate: onUnlock, isPending } = useUnlockChapter();
  const isGuest = checkIfGuest()
  const onClose = () => {
    setOpenUnlock(false)
    setOpenLogIn(false)
    setSelectedChapter(null);
  }

  const handleOnClick = (clickedChapter) => {
    if (clickedChapter.hasAccess) {
      navigate(`/book/reading/${clickedChapter.bookId}/${clickedChapter.id}`);
    }
    else if (isGuest) {
      
      setOpenLogIn(true)
      setSelectedChapter(clickedChapter);
    }
    else {
      console.log(isGuest)
      setSelectedChapter(clickedChapter);
      setOpenUnlock(true);
    }
  }
  return (
    <div className={styles.leftPanel}>

      <section className={styles.upperPanel}>
        <OnBackButton />
        <h3>{chapter.book.name}</h3>
      </section>

      {/* might need to combine all of this to a full ready component */}
      <section className={styles.chapterList}>
        <div className={styles.chaptercolumn}>
          <h3 className={styles.sectionTitle}>Chapters</h3>
          <div className={styles.scrollList}>
            {isChapterLoading ? (
              <p className="loading">Loading...</p>
            ) : chapters?.length > 0 ? (
              chapters.map((chapterItem) => (
                <BookChapters
                  onClick={() => handleOnClick(chapterItem)}
                  key={chapterItem.id} chapter={chapterItem} className={styles.cursorChapter} />
              ))
            ) : (
              <p className={styles.emptyState}>No chapters available.</p>
            )}
            {selectedChapter && (
              <ModelUnlock
                OpenUnlock={OpenUnlock}
                onClose={onClose}
                chapterPrice={selectedChapter.price}
                chapterTitle={selectedChapter.title}
                onUnlock={() => {
                  onUnlock(selectedChapter.id)
                  onClose
                }}
              />
            )}
            {selectedChapter && (
              <LoginModel
                OpenLogIn={OpenLogIn}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

export default ChaptersPanel;
