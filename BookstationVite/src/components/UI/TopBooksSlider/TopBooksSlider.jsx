import { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Link, useLocation } from "react-router-dom";
import { linkStateFromHere } from "../../../utils/navigation";
import styles from "./TopBooksSlider.module.css";
import { EyeIcon, StarIcon } from "../Icons/IconLibrary";
import { addView } from "../../../api/views";
import { formatBookData } from "../../../utils/bookUtils";

function SlideContent({ book, totalViews, ratingAverage }) {
  const location = useLocation();
  const formattedBook = formatBookData(book);
  if (!formattedBook) return null;

  const { name, bookId, coverUrl, description, ratingAverage: bookRatingAvg, authorName } =
    formattedBook;
  const displayRating = ratingAverage ?? bookRatingAvg;

  return (
    <Link
      to={`/book/${bookId}`}
      state={linkStateFromHere(location)}
      onClick={() => addView(bookId)}
      className={styles.contentWrapper}
    >
      <div className={styles.bookcover}>
        <img src={coverUrl} alt={name} className={styles.cover} loading="lazy" />
      </div>

      <div className={styles.bookdetails}>
        <span className={styles.label}>Top Pick</span>
        <h2 className={styles.bookTitle}>{name}</h2>

        <div className={styles.bookinsights}>
          <p>by {authorName}</p>
          <div className={styles.statItem}>
            <StarIcon className={styles.iconStar} />
            {displayRating != null && !Number.isNaN(Number(displayRating))
              ? Number(displayRating).toFixed(1)
              : "0.0"}
          </div>
          <div className={styles.statItem}>
            <EyeIcon className={styles.iconEye} />
            {totalViews ?? "—"}
          </div>
        </div>

        {description && <p className={styles.description}>{description}</p>}

        <span className={styles.primaryBtn}>Read Now →</span>
      </div>
    </Link>
  );
}

function TopBooksSlider({
  books = [],
  viewsByBookId = {},
  ratingsByBookId = {},
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!books.length) return null;

  const currentBook = formatBookData(books[currentIndex]);
  const coverUrl = currentBook?.coverUrl ?? "";

  return (
    <section className={styles.container}>
      <div className={styles.bgImage} style={{ backgroundImage: `url(${coverUrl})` }} />
      <div className={styles.overlay} />

      <div className={styles.slide}>
        <Splide
          onMove={(_, newIndex) => setCurrentIndex(newIndex)}
          options={{
            type: "loop",
            perPage: 1,
            perMove: 1,
            speed: 500,
            autoplay: true,
            interval: 4000,
            pauseOnHover: true,
            arrows: true,
            pagination: true,
            drag: true,
            keyboard: true,
          }}
          aria-label="Top books slider"
        >
          {books.map((book) => (
            <SplideSlide key={book.id ?? book.name}>
              <SlideContent
                book={book}
                totalViews={viewsByBookId[book.id]}
                ratingAverage={ratingsByBookId[book.id]?.ratingAverage}
              />
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </section>
  );
}

export default TopBooksSlider;
