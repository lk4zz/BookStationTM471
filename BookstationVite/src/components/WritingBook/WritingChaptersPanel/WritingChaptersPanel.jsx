import styles from "./WritingChaptersPanel.module.css";
import WritingChapterItem from "./WritingChapterItem";

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
  const handleAdd = () => {
    const title = window.prompt("Chapter title");
    if (!title?.trim()) return;
    onCreateChapter({ bookId, title: title.trim() });
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.head}>
        <h2 className={styles.title}>Chapters</h2>
        <button
          type="button"
          className={styles.addBtn}
          onClick={handleAdd}
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
            onUpdateChapter={onUpdateChapter}
            onDeleteChapter={onDeleteChapter}
            onPublishChapter={onPublishChapter}
            bookId={bookId}
            bookStatus={bookStatus}
            isBusy={isBusy}
          />
        ))}
      </ul>
    </aside>
  );
}

export default WritingChaptersPanel;
