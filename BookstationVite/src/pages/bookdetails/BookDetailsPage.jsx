import { useQuery } from "@tanstack/react-query";
import { getBookById } from "../../api/books";
import { getChaptersFromBook } from "../../api/chapters";
import { getCommentsByBook } from "../../api/fetchComments";
import { useParams } from "react-router-dom";
import BookDetails from "../../components/bookdetailscomp/BookDetails";
import BookDescription from "../../components/bookdetailscomp/BookDescription";
import styles from "./BookDetailsPage.module.css";
import BookChatpers from "../../components/bookdetailscomp/BookChapters";
import Comments from "../../components/bookdetailscomp/Comments";

function BookDetailsPage() {
  const { id } = useParams();
  const numericId = Number(id);

  const {
    data: bookData,
    isLoading: isBookLoading,
    error: bookError,
  } = useQuery({
    queryKey: ["book", numericId],
    queryFn: () => getBookById(numericId),
    enabled: Number.isFinite(numericId),
  });

  const {
    data: chaptersData,
    isLoading: isChapterLoading,
    error: chapterError,
  } = useQuery({
    queryKey: ["chapters", numericId],
    queryFn: () => getChaptersFromBook(numericId),
    enabled: Number.isFinite(numericId),
  });

  const {
    data: commentsData,
    isLoading: iscommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", numericId],
    queryFn: () => getCommentsByBook(numericId),
    enabled: Number.isFinite(numericId),
  });

  if (isBookLoading || isChapterLoading) return <p>Loading...</p>;
  if (bookError) return <p>Error loading the book: {bookError.message}</p>;
  if (chapterError)
    return <p>Error loading the chapters: {chapterError.message}</p>;

  const book = bookData?.data ?? bookData;
  const chapters = chaptersData?.data ?? chaptersData ?? [];
  const comments = commentsData?.data ?? commentsData ?? [];


  return (
    <div className={styles.page}>
      <div className={styles.upperContainer}>
        <BookDetails book={book} />
      </div>

      <div className={styles.lowerContainer}>
        <div className={styles.descCONTAINER}>
          <BookDescription book={book} />
        </div>

        <div className={styles.chapterContainer}>
          {chapters.map((chapter) => (
            <BookChatpers key={chapter.id} chapter={chapter} />
          ))}
        </div>
        <div className={styles.commentsContainer}>
          {comments.map((comment) => (
            <Comments key={comment.id} comment={comment} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookDetailsPage;
