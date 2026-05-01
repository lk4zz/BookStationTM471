import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
import styles from "./BookGrid.module.css";
import BookCoverCard from "../BookCoverCard/BookCoverCard";

const OPTIONS = {
  type: "slide",
  perPage: 5,         // raise to shrink books, lower to enlarge them
  perMove: 2,
  gap: "20px",
  keyboard: "global", // arrow keys work anywhere on the page
  arrows: true,
  pagination: false,
  rewind: false,
  drag: "free",
  snapOnMove: true,
  breakpoints: {
    900: { perPage: 3, perMove: 2, gap: "10px" },
    560: { perPage: 2, perMove: 1, gap: "8px" },
  },
};

export default function BookGrid({
  books = [],
  viewsByBookId = {},
  ratingsByBookId = {},
}) {
  if (!books.length) return null;

  const slides = [];
  let i = 0;

  while (i < books.length) {
    /* ── 1 big book ── */
    const big = books[i];
    if (big) {
      slides.push(
        <SplideSlide key={`big-${big.id}`}>
          <div className={styles.item}>
            <BookCoverCard
              book={big}
              totalViews={viewsByBookId[big.id]}
              ratingAverage={ratingsByBookId[big.id]?.ratingAverage}
            />
          </div>
        </SplideSlide>
      );
      i++;
    }

    /* ── 4 mini books (2 × 2) ── */
    const mini = books.slice(i, i + 4);
    if (mini.length) {
      slides.push(
        <SplideSlide key={`mini-${i}`}>
          <div className={styles.miniWrapper}>
            <div className={styles.miniGroup}>
              {mini.map((book) => (
                <div key={book.id} className={styles.miniItem}>
                  <BookCoverCard
                    book={book}
                    totalViews={viewsByBookId[book.id]}
                    ratingAverage={ratingsByBookId[book.id]?.ratingAverage}
                  />
                </div>
              ))}
            </div>
          </div>
        </SplideSlide>
      );
      i += 4;
    }
  }

  return (
    <Splide className={styles.carousel} options={OPTIONS}>
      {slides}
    </Splide>
  );
}