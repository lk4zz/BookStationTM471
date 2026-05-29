import ChapterCards from "../../../../../../GlobalComponents/Books/ChapterCards/ChapterCards";
import styles from "./ChaptersPanel.module.css";
import OnBackButton from "../../../../../../GlobalComponents/Buttons/OnBackButtons";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import UnlockModal from "../../../../../../GlobalComponents/Modals/UnlockModal/UnlockModal";
import { useUnlockChapter } from "../../../../../../hooks/useChapters/useChaptersForAuthor";
import LoginModel from "../../../../../../GlobalComponents/Modals/LoginWindowModel/LoginModel";
import { checkIfGuest } from "../../../../../../utils/checkIfGuest";
import toast from "react-hot-toast";


function ChaptersPanel({ chapter, chapters, isChapterLoading }) {
  const [OpenUnlock, setOpenUnlock] = useState(false)
  const [OpenLogIn, setOpenLogIn] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: onUnlock, isPending } = useUnlockChapter();
  const isGuest = checkIfGuest()
  const onClose = () => {
    setOpenUnlock(false)
    setOpenLogIn(false)
    setSelectedChapter(null);
  }

  const handleChapterPurchase = (chapterId) => {
    onUnlock(chapterId, {
      onSuccess: () => {
        //toast success result
        toast.success(`${selectedChapter.title} unlocked!`);
        onClose()
      },
      onError: (error) => {
        const errMsg =
          error.message || w
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Not enough coins.";
        //toast error message
        toast.error(errMsg);
      }
    });
  };

  const handleOnClick = (clickedChapter) => {
    if (clickedChapter.hasAccess) {
      navigate(`/book/reading/${clickedChapter.bookId}/${clickedChapter.id}`, {
        replace: true,
        ...(location.state ? { state: location.state } : {}),
      });
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
        <OnBackButton
          onClick={() => navigate(-1)}
        />
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
                <ChapterCards
                  onClick={() => handleOnClick(chapterItem)}
                  key={chapterItem.id} chapter={chapterItem} className={styles.cursorChapter} />
              ))
            ) : (
              <p className={styles.emptyState}>No chapters available.</p>
            )}
            {selectedChapter && (
              <UnlockModal
                isOpen={OpenUnlock}
                onClose={onClose}
                title="Chapter is Locked"
                message={
                  <>
                    Unlock {selectedChapter.title}
                    <br />
                    <br />
                    And discover what happens next
                  </>
                }
                unlockText={`Unlock ${selectedChapter.price}`}
                onUnlock={() => {
                  handleChapterPurchase(selectedChapter.id)
                }}
                isPending={isPending}
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
