import { useState, useRef } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Link } from "react-router-dom";
import styles from "./TopBooksSlider.module.css";
import { EyeIcon, StarIcon } from "../Icons/IconLibrary";
import { addView } from "../../../api/views";
import { useViews } from "../../../hooks/useViews";
import { formatBookData } from "../../../utils/bookUtils";

function SlideContent({ book }) {
  const formattedBook = formatBookData(book);
  if (!formattedBook) return null;

  const { name, bookId, coverUrl, description, ratingAverage, authorName } = formattedBook;
  const { totalViews } = useViews(bookId);

  return (
    <Link
      to={`/book/${bookId}`}
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
            {ratingAverage?.toFixed(1) ?? "0.0"}
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

function TopBooksSlider({ books = [] }) {
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
            speed: 600,
            autoplay: true,
            interval: 5000,
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
              <SlideContent book={book} />
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </section>
  );
}

export default TopBooksSlider;
