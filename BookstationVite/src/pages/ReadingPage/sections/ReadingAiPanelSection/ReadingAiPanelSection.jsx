import WritingAiPanel from "../../../../components/UI/WritingAiPanel/WritingAiPanel";
import styles from "./ReadingAiPanelSection.module.css";

function ReadingAiPanelSection({ chapterId }) {
  return (
    <section className={styles.aiPanelContainer}>
      <WritingAiPanel chapterId={chapterId} />
    </section>
  );
}

export default ReadingAiPanelSection;
