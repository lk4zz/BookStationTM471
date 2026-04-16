import styles from "./LandingFooterSection.module.css";

function LandingFooterSection() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Bookstation. All rights reserved.</p>
    </footer>
  );
}

export default LandingFooterSection;
