import WritingPageSidePanel from "./components/WritingPageSidePanel/WritingPageSidePanel";
import styles from "./WritingBookSidePanelSection.module.css";

function WritingBookSidePanelSection(props) {
  return (
    <section className={styles.chaptersPanelContainer}>
      <WritingPageSidePanel {...props} />
    </section>
  );
}

export default WritingBookSidePanelSection;
