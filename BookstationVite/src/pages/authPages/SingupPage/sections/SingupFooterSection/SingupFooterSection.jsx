import { Link } from "react-router-dom";
import styles from "../../../Auth.module.css";

function SingupFooterSection() {
  return (
    <p className={styles.footerText}>
      Already have an account?{" "}
      <Link to="/login" className={styles.link}>
        Log in
      </Link>
    </p>
  );
}

export default SingupFooterSection;
