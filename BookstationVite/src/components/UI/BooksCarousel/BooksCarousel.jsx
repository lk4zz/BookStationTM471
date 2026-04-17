import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import BookCoverCard from "../BookCoverCard/BookCoverCard";

function BooksCarousel({
  books = {},
  viewsByBookId = {},
  ratingsByBookId = {},
}) {
    if (!books.length) return null;

    return (
        <Splide
            options={{
                // Core behavior
                type: "loop",
                speed: 500,

                // Layout
                perPage: 7,
                perMove: 1,
                gap: "15px",
                focus: "center",

                // Interaction
                drag: true,
                snap: true,
                wheel: true,
                keyboard: true,
                flickPower: 300,

                // UI controls
                arrows: true,
                pagination: false,

                // Performance
                lazyLoad: "nearby",

                // Responsive
                breakpoints: {
                    1280: { perPage: 6 },
                    960: { perPage: 4 },
                    640: { perPage: 2 },
                },
            }}
            aria-label="Popular books carousel"
        >
            {books.map((book) => (
                <SplideSlide key={book.id}>
                    <BookCoverCard
                        book={book}
                        totalViews={viewsByBookId[book.id]}
                        ratingAverage={ratingsByBookId[book.id]?.ratingAverage}
                    />
                </SplideSlide>
            ))}
        </Splide>
    );
}

export default BooksCarousel;
