import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllBooks } from "../../api/books";
import BookCard from "../../components/ExplorePageComp/BookCard";
import { SparklesIcon, CoinsIcon, BookOpenIcon } from "../../components/UI/IconLibrary"; 
import styles from "./LandingPage.module.css";

function LandingPage() {
  const navigate = useNavigate();

  // Fetching books for the showcase section
  const { data, isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: getAllBooks,
  });

  // Extract a subset of books for the landing page preview (e.g., top 6)
  const showcaseBooks = data?.data?.slice(0, 6) || [];

  return (
    <div className={styles.pageWrapper}>
      {/* Navigation Header */}
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

      {/* Hero Section */}
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

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIconWrapper}>
            <SparklesIcon className={styles.featureIcon} />
          </div>
          <h3>AI-Powered Experience</h3>
          <p>Overcome writer's block with our AI writing assistant, or dive deeper into lore with your personal AI reading partner.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIconWrapper}>
            <CoinsIcon className={styles.featureIcon} />
          </div>
          <h3>Fair Monetization</h3>
          <p>Unlock stories chapter by chapter using coins, or subscribe for unlimited access. Support your favorite authors directly.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIconWrapper}>
            <BookOpenIcon className={styles.featureIcon} />
          </div>
          <h3>Publish As You Go</h3>
          <p>Create an ongoing book and publish chapters in real-time. Build an active audience while your story unfolds.</p>
        </div>
      </section>

      {/* Dynamic Book Showcase Section */}
      <section className={styles.showcase}>
        <div className={styles.showcaseHeader}>
          <h2>Trending on Bookstation</h2>
          <Link to="/explore" className={styles.exploreLink}>
            Explore All →
          </Link>
        </div>

        {isLoading ? (
          <p className={styles.loadingState}>Loading amazing stories...</p>
        ) : error ? (
          <p className={styles.errorState}>Failed to load books. Please try again later.</p>
        ) : (
          <div className={styles.bookGrid}>
            {showcaseBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Bookstation. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;