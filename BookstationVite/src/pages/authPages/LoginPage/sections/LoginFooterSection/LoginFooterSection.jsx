import { Link } from "react-router-dom";
import styles from "../../../Auth.module.css";

function LoginFooterSection() {
  return (
    <p className={styles.footerText}>
      Don't have an account?{" "}
      <Link to="/signup" className={styles.link}>
        Sign up
      </Link>
    </p>
  );
}

export default LoginFooterSection;
