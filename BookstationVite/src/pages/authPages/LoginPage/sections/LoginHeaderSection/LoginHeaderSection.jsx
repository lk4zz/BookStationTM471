import { Link } from "react-router-dom";
import { SparklesIcon } from "../../../../../components/UI/Icons/IconLibrary";
import styles from "../../../Auth.module.css";

function LoginHeaderSection() {
  return (
    <div className={styles.header}>
      <Link to="/" className={styles.logo}>
        Bookstation <SparklesIcon className={styles.logoIcon} />
      </Link>
      <h1 className={styles.title}>Welcome Back</h1>
      <p className={styles.subtitle}>Log in to continue your journey.</p>
    </div>
  );
}

export default LoginHeaderSection;
