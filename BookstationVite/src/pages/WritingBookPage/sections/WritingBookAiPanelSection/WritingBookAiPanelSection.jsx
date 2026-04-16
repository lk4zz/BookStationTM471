import WritingAiPanel from "../../../../components/UI/WritingAiPanel/WritingAiPanel";
import styles from "./WritingBookAiPanelSection.module.css";

function WritingBookAiPanelSection({ chapterId }) {
  return (
    <section className={styles.AiPanelContainer}>
      <WritingAiPanel chapterId={chapterId} />
    </section>
  );
}

export default WritingBookAiPanelSection;
