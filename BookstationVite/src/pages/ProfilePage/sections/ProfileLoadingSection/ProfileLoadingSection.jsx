import { Loading } from "../../../../components/UI/Loading/Loading";
import styles from "./ProfileLoadingSection.module.css";

function ProfileLoadingSection() {
  return (
    <main className={styles.loadingMain}>
      <Loading variant="inline" />
    </main>
  );
}

export default ProfileLoadingSection;
