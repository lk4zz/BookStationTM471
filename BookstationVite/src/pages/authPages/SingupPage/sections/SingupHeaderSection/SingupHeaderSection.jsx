import { Link } from "react-router-dom";
import { SparklesIcon } from "../../../../../components/UI/Icons/IconLibrary";
import styles from "../../../Auth.module.css";

function SingupHeaderSection() {
  return (
    <div className={styles.header}>
      <Link to="/" className={styles.logo}>
        Bookstation <SparklesIcon className={styles.logoIcon} />
      </Link>
      <h1 className={styles.title}>Create an Account</h1>
      <p className={styles.subtitle}>
        Join the community of readers and writers.
      </p>
    </div>
  );
}

export default SingupHeaderSection;
