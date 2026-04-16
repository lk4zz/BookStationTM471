import styles from "./ProfileMessageSection.module.css";

function ProfileMessageSection({ message }) {
  return <p className={styles.error}>{message}</p>;
}

export default ProfileMessageSection;
