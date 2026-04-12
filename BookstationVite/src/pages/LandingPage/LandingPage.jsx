import React from "react";
import { Link, useNavigate } from "react-router-dom";
import BookCard from "../../components/UI/BookCard/BookCard";
import { SparklesIcon, CoinsIcon, BookOpenIcon } from "../../components/UI/Icons/IconLibrary";
import styles from "./LandingPage.module.css";
import FeaturesCard from "../../components/LandingPageComp/FeaturesCard/FeaturesCard";
import { useAllBooks } from "../../hooks/useBooks";
import GenreBox from "../../components/LandingPageComp/GenreBox/GenreBox";
import { useAllGenres } from "../../hooks/useGenres";
import GenreSection from "../../components/ExplorePageComp/GenreSection/GenreSection";
import BookCoverCard from "../../components/UI/BookCoverCard/BookCoverCard";
import { useTrendingBooks } from "../../hooks/useBooks";

function CreateBookCard() {
  const navigate = useNavigate();
  return (
    <div 
    onClick={() => navigate('/signup')}
    className={styles.createCard}>
      <div className={styles.plus}>＋</div>
      <h3>YOUR OWN STORY</h3>
      <p>Tell the world your story.</p>
    </div>
  );
}

function LandingPage() {

  const navigate = useNavigate();
  const { books, isBooksLoading, booksError } = useAllBooks()
  const { genres, isGenresLoading, genresError } = useAllGenres();
  const { trendingBooks, isTrendingLoading, trendingError } = useTrendingBooks();
  const randomGenre =
    genres[Math.floor(Math.random() * genres.length)];
  if (isTrendingLoading) return <p className="loading"> Loading...</p>;
  if (trendingError) return <p className="loading"> {trendingError.message}</p>;
  if (isGenresLoading) return <p>loading..</p>
  if (genresError) return <p>{genresError.message}</p>

  return (
    <div className={styles.pageWrapper}>
      {/* could be a component */}
      {/* navigation Header makecomponent later */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          Bookstation <SparklesIcon className={styles.logoIcon} />
        </div>
        <div className={styles.authActions}>
          <button
            className={styles.loginBtn}
            onClick={() => navigate('/login')}
          >
            Log In
          </button>
          <button
            className={styles.signupBtn}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        </div>
      </nav>
      {/* could be a component */}
      {/* hero Section make component later */}
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Because Everyone Deserves To Tell Their Own <span>Story</span>
        </h1>
        <p className={styles.heroSubtitle}>
          The ultimate platform for readers and writers. Co-write your masterpiece,
          chat with your AI reading partner, and support creators through chapter microtransactions.
        </p>
        <button
          className={styles.primaryCta}
          onClick={() => navigate('/signup')}
        >
          Start Reading Now
        </button>
      </header>

      <section className={styles.features}>
        <FeaturesCard Icon={SparklesIcon} header="AI-Powered Experience"
          text="Overcome writer's block with our AI writing assistant, or dive deeper into lore with your personal AI reading partner." />
        <FeaturesCard Icon={CoinsIcon} header="Fair Monetization"
          text="Unlock stories chapter by chapter using coins, or subscribe for unlimited access. Support your favorite authors directly." />
        <FeaturesCard Icon={BookOpenIcon} header="Publish As You Go"
          text="Create an ongoing book and publish chapters in real-time. Build an active audience while your story unfolds." />
      </section>

      {/* guest should not access explore section*/}
      <section className={styles.showcase}>
        <div className={styles.showcaseHeader}>
          <h2>Trending on Bookstation</h2>

        </div>

        {isTrendingLoading ? (
          <p className={styles.loadingState}>Loading amazing stories...</p>
        ) : trendingError ? (
          <p className={styles.errorState}>Failed to load books. Please try again later.</p>
        ) : (
          <div className="gridContainer">
            {trendingBooks?.map((book) => (
              <BookCoverCard key={book.id} book={book} />
              
            ))}

            <CreateBookCard className={styles.createCardContainer} />
            
          </div>
        )}
      </section>

      <section className={styles.showcase}>

        <GenreSection genre={randomGenre} />
        

      </section>

      <section className={styles.showcase}>
        <div className={styles.showcaseHeader}></div>
        <h1>Pick your favourite genre</h1>
        <div className={styles.genreBoxes}>
          {genres.map((genre) => (
            <GenreBox key={genre.id} genre={genre} />
          ))}
        </div>
      </section>
      {/* could be a component */}
      {/* footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Bookstation. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;