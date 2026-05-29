import WritingAiPanel from "../../../../GlobalComponents/AI/AIPanel/AIPanel";
import styles from "./ReadingAiPanelSection.module.css";

function ReadingAiPanelSection({ chapterId, currentUser }) {
  return (
    <section className={styles.aiPanelContainer}>
      <WritingAiPanel 
      currentUser={currentUser}
      chapterId={chapterId} />
    </section>
  );
}

export default ReadingAiPanelSection;
