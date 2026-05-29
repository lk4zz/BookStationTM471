import { useNavigate } from "react-router-dom";
import styles from "./LandingHeroSection.module.css";
import { SparklesIcon } from "../../../../GlobalComponents/Icons/IconLibrary";

function LandingHeroSection() {
  const navigate = useNavigate();

  return (
    <header className={styles.hero}>
      {/* Ambient background glow effect */}
      <div className={styles.heroGlow}></div>

      {/* Intro Badge */}
      <div className={styles.badge}>
        <SparklesIcon className={styles.badgeIcon} />
        <span>The Future of Fiction</span>
      </div>

      <h1 className={styles.heroTitle}>
        Because Everyone Deserves To Tell Their Own{" "}
        <span className={styles.highlight}>Story</span>
      </h1>
      
      <p className={styles.heroSubtitle}>
        The ultimate platform for readers and writers. Co-write your masterpiece,
        chat with your AI reading partner, and support creators directly.
      </p>
      
      <div className={styles.ctaGroup}>
        <button
          className={styles.primaryCta}
          onClick={() => navigate("/signup")}
        >
          Start Reading
        </button>
      </div>
    </header>
  );
}

export default LandingHeroSection;