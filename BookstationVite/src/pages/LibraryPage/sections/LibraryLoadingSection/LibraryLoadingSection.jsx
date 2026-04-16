import { Loading } from "../../../../components/UI/Loading/Loading";
import styles from "./LibraryLoadingSection.module.css";

function LibraryLoadingSection() {
  return (
    <main className={styles.centeredContent}>
      <Loading />
    </main>
  );
}

export default LibraryLoadingSection;
