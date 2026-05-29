import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WarningModal from "../../../../GlobalComponents/Modals/WarningModal/WarningModal";
import {
  Ticket,
  Clock,
  User,
  BookOpen,
  AlertCircle,
  MessageSquare,
  CheckCircle,
  Ban,
  Trash2,
  ExternalLink
} from "lucide-react";
import styles from "./AdminReviewQueueSection.module.css";

const STATUS_LABELS = {
  UNDER_REVIEW: "Under Review",
  AWAITING_AUTHOR: "Awaiting Author",
  CLOSED: "Closed",
};

const ACTOR_LABELS = {
  ADMIN: "Admin",
  AUTHOR: "Author",
  SYSTEM: "System",
};

function StatusBadge({ status }) {
  return (
    <span className={`${styles.badge} ${styles[`badge_${status}`]}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function HistoryTimeline({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <div className={styles.timelineWrapper}>
      <h5 className={styles.timelineTitle}>Activity History</h5>
      <div className={styles.timeline}>
        {history.map((event, idx) => (
          <div key={idx} className={styles.timelineEvent}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <div className={styles.timelineHeader}>
                <span className={styles.timelineActor}>
                  {ACTOR_LABELS[event.actorType] ?? event.actorType}
                </span>
                {event.toStatus && (
                  <span className={styles.timelineTransition}>
                    changed status to <strong>{STATUS_LABELS[event.toStatus] ?? event.toStatus}</strong>
                  </span>
                )}
                <span className={styles.timelineDate}>
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>
              {event.note && (
                <div className={styles.timelineNote}>
                  <MessageSquare size={12} />
                  <p>{event.note}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminReviewQueueSection({
  queue,
  onUnflag,
  isUnflagging,
  onDeleteBook,
  isDeleting,
  onBanUser,
  isBanning,
  onSendFeedback,
  isSendingFeedback,
}) {
  const navigate = useNavigate();
  const [bookToDelete, setBookToDelete] = useState(null);
  const [userToBan, setUserToBan] = useState(null);
  const [bookToUnflag, setBookToUnflag] = useState(null);
  const [unflagMessage, setUnflagMessage] = useState("Your book has been reviewed and restored to the platform.");
  const [bookToFeedback, setBookToFeedback] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  if (!queue || queue.length === 0) {
    return (
      <div className={styles.emptyState}>
        <CheckCircle size={48} className={styles.emptyIcon} />
        <p>No books currently pending review. Inbox zero!</p>
      </div>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.heading}>Review Queue</h2>
          <p className={styles.subheading}>
            Books submitted by authors for admin review. System-flagged books appear here automatically.
          </p>
        </div>
        <span className={styles.queueCount}>{queue.length} Pending</span>
      </div>

      <div className={styles.ticketList}>
        {queue.map((moderationCase) => {
          const book = moderationCase.book;
          const author = book?.author || book?.user;
          const history = Array.isArray(moderationCase.history) ? moderationCase.history : [];

          return (
            <article key={moderationCase.id} className={styles.ticketCard}>

              {/* Ticket Header... (keep as is) */}

              {/* Ticket Body */}
              <div className={styles.ticketBody}>

                {/* REPLACED: Book Context Block */}
                <div className={styles.bookContext}>
                  <div className={styles.contextRow}>
                    <div className={styles.contextLabelGroup}>
                      <BookOpen size={16} className={styles.contextIconBook} />
                      <span className={styles.contextLabel}>Target Book:</span>
                    </div>
                    <button
                      className={styles.contextLinkBtn}
                      onClick={() => navigate(`/book/${book?.id}`)}
                      title="Open book details"
                    >
                      <span className={styles.linkText}>{book?.name || "Untitled Book"}</span>
                      <ExternalLink size={14} className={styles.linkIcon} />
                    </button>
                  </div>

                  <div className={styles.contextRow}>
                    <div className={styles.contextLabelGroup}>
                      <User size={16} className={styles.contextIconUser} />
                      <span className={styles.contextLabel}>Author Profile:</span>
                    </div>
                    {author?.name ? (
                      <button
                        onClick={() => navigate(`/author/${author?.id || book?.userId}`)}
                        className={styles.contextLinkBtn}
                        title="Open author profile"
                      >
                        <span className={styles.linkText}>{author.name}</span>
                        {author.email && <span className={styles.textDim}>({author.email})</span>}
                        <ExternalLink size={14} className={styles.linkIcon} />
                      </button>
                    ) : (
                      <span className={styles.textDim}>Unknown Author (ID: {book?.userId || "N/A"})</span>
                    )}
                  </div>
                </div>

                <div className={styles.reasonBlock}>
                  <div className={styles.reasonHeader}>
                    <AlertCircle size={14} /> <strong>Original Reason for Flagging</strong>
                  </div>
                  <p>{moderationCase.reason}</p>
                </div>

                {moderationCase.authorSubmissionNote && (
                  <div className={styles.authorNoteBlock}>
                    <div className={styles.reasonHeader}>
                      <MessageSquare size={14} /> <strong>Author&apos;s Fix Note</strong>
                    </div>
                    <p>{moderationCase.authorSubmissionNote}</p>
                  </div>
                )}

                <HistoryTimeline history={history} />
              </div>

              {/* Ticket Actions */}
              <footer className={styles.ticketActions}>
                <div className={styles.actionGroupLeft}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.approveBtn}`}
                    disabled={isUnflagging}
                    onClick={() => {
                      setUnflagMessage("Your book has been reviewed and restored to the platform.");
                      setBookToUnflag(book);
                    }}
                  >
                    <CheckCircle size={16} /> Approve & Restore
                  </button>

                  <button
                    type="button"
                    className={`${styles.btn} ${styles.feedbackBtn}`}
                    disabled={isSendingFeedback}
                    onClick={() => {
                      setFeedbackMessage("");
                      setBookToFeedback(book);
                    }}
                  >
                    <MessageSquare size={16} /> {isSendingFeedback ? "Sending..." : "Send Feedback"}
                  </button>
                </div>

                <div className={styles.actionGroupRight}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.deleteBtn}`}
                    disabled={isDeleting}
                    onClick={() => setBookToDelete(book)}
                  >
                    <Trash2 size={16} /> Delete Book
                  </button>

                  {author && (
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.banBtn}`}
                      disabled={isBanning}
                      onClick={() => setUserToBan({ author, userId: book.userId })}
                    >
                      <Ban size={16} /> Ban Author
                    </button>
                  )}
                </div>
              </footer>
            </article>
          );
        })}
      </div>

      {/* Modals remain exactly the same as provided... */}
      {bookToDelete && (
        <WarningModal
          heading="Delete Book Permanently?"
          message={`Reject and delete "${bookToDelete?.name ?? "this book"}" permanently?`}
          onConfirm={() => {
            onDeleteBook(bookToDelete.id);
            setBookToDelete(null);
          }}
          onClose={() => setBookToDelete(null)}
          isPending={isDeleting}
          confirmText="Delete Book"
          pendingText="Deleting…"
        />
      )}

      {bookToUnflag && (
        <WarningModal
          heading="Approve & Restore"
          message="Approve this book and restore it to the catalog? You can include a message to the author:"
          textField={true}
          inputValue={unflagMessage}
          onInputChange={setUnflagMessage}
          onConfirm={() => {
            onUnflag({ bookId: bookToUnflag.id, message: unflagMessage });
            setBookToUnflag(null);
          }}
          onClose={() => setBookToUnflag(null)}
          isPending={isUnflagging}
          confirmText="Approve & Restore"
          pendingText="Restoring…"
        />
      )}

      {bookToFeedback && (
        <WarningModal
          heading="Send Feedback"
          message="Send feedback to the author (they will need to fix and resubmit):"
          textField={true}
          inputValue={feedbackMessage}
          onInputChange={setFeedbackMessage}
          onConfirm={() => {
            if (feedbackMessage.trim()) {
              onSendFeedback({ bookId: bookToFeedback.id, message: feedbackMessage.trim() });
              setBookToFeedback(null);
            }
          }}
          onClose={() => setBookToFeedback(null)}
          isPending={isSendingFeedback}
          confirmText="Send Feedback"
          pendingText="Sending…"
        />
      )}

      {userToBan && (
        <WarningModal
          heading="Ban Author?"
          message={`Ban author "${userToBan.author.name}" (${userToBan.author.email})? This will delete their account.`}
          onConfirm={() => {
            onBanUser(userToBan.userId);
            setUserToBan(null);
          }}
          onClose={() => setUserToBan(null)}
          isPending={isBanning}
          confirmText="Ban Author"
          pendingText="Banning…"
        />
      )}
    </section>
  );
}