import styles from "./WritingAiPanel.module.css";
import InputText from "../InputFields/InputText";
import { useAIPrompting } from "../../../hooks/features/useAIPrompting";
import AIChat from "./AIChat";

function WritingAiPanel({ chapterId }) {
  const {
    promptInput,
    handlePromptInput,
    handleSendPrompt,
    messages,
  } = useAIPrompting(chapterId);

  return (
    <aside className={styles.panel}>
      <div>
        <h2 className={styles.title}>Writing assistant</h2>
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
