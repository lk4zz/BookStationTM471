import { useNavigate } from "react-router-dom";
import { SparklesIcon } from "../../../../components/UI/Icons/IconLibrary";
import styles from "./LandingNavSection.module.css";

function LandingNavSection() {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        Bookstation <SparklesIcon className={styles.logoIcon} />
      </div>
      <div className={styles.authActions}>
        <button
          className={styles.loginBtn}
          onClick={() => navigate("/login")}
        >
          Log In
        </button>
        <button
          className={styles.signupBtn}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export default LandingNavSection;
