import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import NavBar from "../../components/UI/NavBar/NavBar";
import WritingCanvas from "../../components/WritingBook/WritingCanvas/WritingCanvas";
import WritingChaptersPanel from "../../components/WritingBook/WritingChaptersPanel/WritingChaptersPanel";
import WritingAiPanel from "../../components/WritingBook/WritingAiPanel/WritingAiPanel";
import { useBookForWriting, useUpdateBookStatus } from "../../hooks/useBooks";
import {
  useChaptersForAuthor,
  useCreateChapter,
  useUpdateChapter,
  useDeleteChapter,
  usePublishChapter,
} from "../../hooks/useChapters";
import { useAuthorPages } from "../../hooks/useWritingPages";
import { checkIfGuest } from "../../utils/checkIfGuest";
import styles from "./WritingBookPage.module.css";

const STATUS_OPTIONS = ["DRAFT", "ONGOING", "COMPLETED"];

function WritingBookPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const numericBookId = Number(bookId);

  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [statusError, setStatusError] = useState(null);

  const { book, isLoading: bookLoading, error: bookError } =
    useBookForWriting(numericBookId);
  const { chapters, isLoading: chaptersLoading } =
    useChaptersForAuthor(numericBookId);
  const { pages, isLoading: pagesLoading } = useAuthorPages(selectedChapterId);

  const createChapter = useCreateChapter();
  const updateChapter = useUpdateChapter();
  const deleteChapter = useDeleteChapter();
  const publishChapter = usePublishChapter();
  const updateBookStatus = useUpdateBookStatus();

  useEffect(() => {
    if (checkIfGuest()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!chapters?.length) {
      setSelectedChapterId(null);
      return;
    }
    const q = Number(searchParams.get("chapter"));
    if (Number.isFinite(q) && chapters.some((c) => c.id === q)) {
      setSelectedChapterId(q);
      return;
    }
    const first = chapters[0].id;
    setSelectedChapterId(first);
    setSearchParams({ chapter: String(first) }, { replace: true });
  }, [chapters, searchParams, setSearchParams]);

  const selectChapter = (id) => {
    setSelectedChapterId(id);
    if (id) setSearchParams({ chapter: String(id) });
    else setSearchParams({});
  };

  const initialHtml = useMemo(() => {
    const p = pages?.[0];
    return p?.text || "<p></p>";
  }, [pages, selectedChapterId]);

  const handleStatusChange = (e) => {
    const next = e.target.value;
    setStatusError(null);
    updateBookStatus.mutate(
      { bookId: numericBookId, requestedStatus: next },
      {
        onSuccess: () => setStatusError(null),
        onError: (err) => {
          setStatusError(err.message || "Could not update status.");
        },
      },
    );
  };

  const busy =
    createChapter.isPending ||
    updateChapter.isPending ||
    deleteChapter.isPending ||
    publishChapter.isPending;

  if (checkIfGuest()) return null;

  if (bookLoading) {
    return (
      <div className={styles.page}>
        <NavBar />
        <p className={styles.centerMsg}>Loading book…</p>
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className={styles.page}>
        <NavBar />
        <p className={styles.centerMsg}>
          {bookError?.message || "Book not found."}{" "}
          <Link to="/writing" className={styles.backLink}>
            Back to writing
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <NavBar />
      <header className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Link to="/writing" className={styles.back}>
            ← Drafts
          </Link>
          <h1 className={styles.bookTitle}>{book.name}</h1>
        </div>
        <div className={styles.toolbarRight}>
          <label className={styles.statusLabel}>
            Book status
            <select
              className={styles.statusSelect}
              value={book.status}
              onChange={handleStatusChange}
              disabled={updateBookStatus.isPending}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>
      {statusError && <p className={styles.statusErr}>{statusError}</p>}

      <div className={styles.layout}>
        <section className={styles.side}>
          <WritingChaptersPanel
            bookId={numericBookId}
            chapters={chapters}
            selectedChapterId={selectedChapterId}
            onSelectChapter={selectChapter}
            onCreateChapter={(payload) => createChapter.mutate(payload)}
            onDeleteChapter={(payload) =>
              deleteChapter.mutate(payload, {
                onSuccess: () => {
                  if (selectedChapterId === payload.chapterId) {
                    setSelectedChapterId(null);
                    setSearchParams({}, { replace: true });
                  }
                },
              })
            }
            onUpdateChapter={(payload) => updateChapter.mutate(payload)}
            onPublishChapter={(payload) => publishChapter.mutate(payload)}
            isBusy={busy}
          />
        </section>

        <section className={styles.main}>
          <WritingCanvas
            chapterId={selectedChapterId}
            bookId={numericBookId}
            initialHtml={initialHtml}
            isLoading={chaptersLoading || pagesLoading}
          />
        </section>

        <section className={styles.ai}>
          <WritingAiPanel />
        </section>
      </div>
    </div>
  );
}

export default WritingBookPage;
