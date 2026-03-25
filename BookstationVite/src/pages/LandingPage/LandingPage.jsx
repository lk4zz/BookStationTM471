import React from "react";
import { Link, useNavigate } from "react-router-dom";
import BookCard from "../../components/ExplorePageComp/BookCard";
import { SparklesIcon, CoinsIcon, BookOpenIcon } from "../../components/UI/IconLibrary";
import styles from "./LandingPage.module.css";
import FeaturesCard from "../../components/LandingPageComp/FeaturesCard";
import { useAllBooks } from "../../hooks/useBooks";

function LandingPage() {

  const navigate = useNavigate();
  const { books, isBooksLoading, booksError } = useAllBooks()
  if (isBooksLoading) return <p /*className={Styles.loading}*/> Loading...</p>;
  if (booksError) return <p /*className={Styles.error}*/> {booksError.message}</p>;


  //  this only shows a sample edit later to be all books and genres so guest can explore
  const showcaseBooks = books?.slice(0, 6) || [];

  return (
    <div className={styles.pageWrapper}>
      {/* navigation Header */}
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

      {/* hero Section */}
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

      {/* features Section these can be grouped into one reusable component*/}

      <section className={styles.features}>
        <FeaturesCard Icon={SparklesIcon} header="AI-Powered Experience"
          text="Overcome writer's block with our AI writing assistant, or dive deeper into lore with your personal AI reading partner." />
        <FeaturesCard Icon={CoinsIcon} header="Fair Monetization"
          text="Unlock stories chapter by chapter using coins, or subscribe for unlimited access. Support your favorite authors directly." />
        <FeaturesCard Icon={BookOpenIcon} header="Publish As You Go"
          text="Create an ongoing book and publish chapters in real-time. Build an active audience while your story unfolds." />
      </section>

      {/* dynamic Book Showcase Section fix this later to allow all exploration*/}
      <section className={styles.showcase}>
        <div className={styles.showcaseHeader}>
          <h2>Trending on Bookstation</h2>
          <Link to="/explore" className={styles.exploreLink}>
            Explore All →
          </Link>
        </div>

        {isBooksLoading ? (
          <p className={styles.loadingState}>Loading amazing stories...</p>
        ) : booksError ? (
          <p className={styles.errorState}>Failed to load books. Please try again later.</p>
        ) : (
          <div className={styles.bookGrid}>
            {showcaseBooks?.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Bookstation. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;