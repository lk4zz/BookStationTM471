import styles from "./WritingAiPanel.module.css";
import InputText from "../../UI/InputFields/InputText";
import { useAIPrompting } from "../../../hooks/features/useAIPrompting";
import AIChat from "./AIChat";

function WritingAiPanel() {
  const {
    promptInput,
    handlePromptInput,
    handleSendPrompt,
    messages,
  } = useAIPrompting();

  return (
    <aside className={styles.panel}>
      <div>
        <h2 className={styles.title}>Writing assistant</h2>
        {/* <p className={styles.placeholder}>
          AI tools for brainstorming, tone, and continuity will appear here.
        </p> */}
      </div>
      <AIChat messages={messages} />
      <InputText
        value={promptInput}
        onChange={handlePromptInput}
        onSubmit={handleSendPrompt}
        placeholder="prompt AI"
        // disabled="{submitCommentMutation.isPending}" 
        />
    </aside>
  );
}

export default WritingAiPanel;
