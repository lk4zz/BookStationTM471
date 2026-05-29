import WritingAiPanel from "../../../../GlobalComponents/AI/AIPanel/AIPanel";
import styles from "./WritingBookAiPanelSection.module.css";

function WritingBookAiPanelSection({ chapterId, currentUser }) {
  return (
    <section className={styles.AiPanelContainer}>
      <WritingAiPanel 
      currentUser={currentUser}
      chapterId={chapterId} />
    </section>
  );
}

export default WritingBookAiPanelSection;
