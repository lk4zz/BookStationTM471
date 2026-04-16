import { useNavigate } from "react-router-dom";
import styles from "./LandingHeroSection.module.css";

function LandingHeroSection() {
  const navigate = useNavigate();

  return (
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
        onClick={() => navigate("/signup")}
      >
        Start Reading Now
      </button>
    </header>
  );
}

export default LandingHeroSection;
