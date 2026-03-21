import { useQuery } from "@tanstack/react-query";
import { getBookById } from "../../api/books";
import { useParams } from "react-router-dom";
import BookDetails from "../../components/bookdetailscomp/BookDetails";
import BookDescription from "../../components/bookdetailscomp/BookDescription";
import styles from "./BookDetailsPage.module.css";

function BookDetailsPage() {
  const { id } = useParams();
  const numericId = Number(id);

  const {
    data: bookData,
    isLoading: isBookLoading,
    error: bookError,
  } = useQuery({
    queryKey: ["book", id],
    queryfn: () => getBookbyId(numericId),
  });

  const {
    data: chaptersData,
    isLoading: isChapterLoading,
    error: chapterError,
  } = useQuery({
    queryKey: ["chapter", id],
    queryFn: () => getChapterById(numericId),
  });
}
if (isBookLoading || isChaptersLoading) return <p>Loading kitchen...</p>;


if (bookError) return <p>Error loading the book: {bookError.message}</p>;
if (chaptersError)
  return <p>Error loading the chapters: {chaptersError.message}</p>;


const book = bookData?.data;

const chapters = chaptersData?.data || chaptersData;

return (
  <div>
    <BookDetails book={book} />
    <div className={styles.descCONTAINER}>
      <BookDescription book={book} />
    </div>
  </div>
);

export default BookDetailsPage;
