import { useState } from "react";
import styles from "./WritingChaptersPanel.module.css";
import WritingChapterItem from "./WritingChapterItem";
import ChapterModal from "../ChapterModal/ChapterModal";

function WritingChaptersPanel({
  bookId,
  chapters,
  selectedChapterId,
  onSelectChapter,
  onCreateChapter,
  onDeleteChapter,
  onUpdateChapter,
  onPublishChapter,
  bookStatus,
  isBusy,
}) {
  const [editingChapter, setEditingChapter] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openCreate = () => {
    setEditingChapter(null);
    setShowModal(true);
  };

  const openEdit = (ch) => {
    setEditingChapter(ch);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingChapter(null);
    setShowModal(false);
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.head}>
        <h2 className={styles.title}>Chapters</h2>
        <button
          type="button"
          className={styles.addBtn}
          onClick={openCreate}
          disabled={isBusy}
        >
          + New
        </button>
      </div>
      <ul className={styles.list}>
        {chapters?.length === 0 && (
          <li className={styles.empty}>No chapters yet. Create one to write.</li>
        )}
        {chapters?.map((ch) => (
          <WritingChapterItem
            key={ch.id}
            ch={ch}
            isActive={ch.id === selectedChapterId}
            onSelectChapter={onSelectChapter}
            onEdit={() => openEdit(ch)}
            bookStatus={bookStatus}
          />
        ))}
      </ul>

      {showModal && (
        <ChapterModal
          chapter={editingChapter}
          bookId={bookId}
          bookStatus={bookStatus}
          onCreateChapter={onCreateChapter}
          onUpdateChapter={onUpdateChapter}
          onDeleteChapter={onDeleteChapter}
          onPublishChapter={onPublishChapter}
          onClose={closeModal}
          isBusy={isBusy}
        />
      )}
    </aside>
  );
}

export default WritingChaptersPanel;
