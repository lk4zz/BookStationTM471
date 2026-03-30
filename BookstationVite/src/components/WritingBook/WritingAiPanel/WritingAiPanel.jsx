import styles from "./WritingAiPanel.module.css";

function WritingAiPanel() {
  return (
    <aside className={styles.panel}>
      <h2 className={styles.title}>Writing assistant</h2>
      <p className={styles.placeholder}>
        AI tools for brainstorming, tone, and continuity will appear here.
      </p>
    </aside>
  );
}

export default WritingAiPanel;
