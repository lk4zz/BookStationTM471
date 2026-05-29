import { useState } from "react";
import toast from "react-hot-toast";
import styles from "./AIPanel.module.css";
import InputText from "../../Forms/InputFields/InputText";
import { useAIPrompting } from "../../../hooks/features/useAIPrompting";
import AIChat from "../AIChat/AIChat";
import { usePurchaseAIPass } from "../../../hooks/useWallet";
import UnlockModal from "../../Modals/UnlockModal/UnlockModal";

function WritingAiPanel({ chapterId, currentUser }) {

    //unlock modal window for AI unlock
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { mutate: buyAIPass, isPending } = usePurchaseAIPass();

    const {
        promptInput,
        handlePromptInput,
        handleSendPrompt,
        messages,
    } = useAIPrompting(chapterId);

    // The binary check for AI service (wether expired or not)
    const hasAIAccess = currentUser?.aiAccessExpires && new Date(currentUser.aiAccessExpires) > new Date();

    //the function to handle AI purchase pass
    const handlePurchase = () => {
        buyAIPass(undefined, {
            onSuccess: () => {
                //toast success result
                toast.success("AI Pass unlocked for 3 hours!");
                setIsModalOpen(false);
            },
            onError: (error) => {
                const errMsg =
                    error.message ||
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Not enough coins.";
                //toast error message
                toast.error(errMsg);
            }
        });
    };

    return (
        <aside className={styles.panel}>
            <div>
                <h2 className={styles.title}>Bookie AI</h2>
            </div>

            {/* the chat bubbles */}
            <AIChat messages={messages} />

            {hasAIAccess ? (
                <InputText
                    value={promptInput}
                    onChange={handlePromptInput}
                    onSubmit={handleSendPrompt}
                    placeholder="prompt AI"
                />
            ) : (
                <div
                    className={styles.lockedInput}
                    onClick={() => setIsModalOpen(true)}
                    title="Click to unlock AI"
                >
                    🔒 AI Locked. Click to unlock.
                </div>
            )}

            {/* the global unlock modal window with costume values*/}
            <UnlockModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUnlock={handlePurchase}
                isPending={isPending}
                title="AI Assistant Locked"
                message={
                    <>
                        Unlock unlimited AI access for 3 hours.
                        <br />
                        <br />
                        Cost: 100 Coins
                    </>
                }
                unlockText="Unlock 100"
                pendingText="Processing..."
            />
        </aside>
    );
}

export default WritingAiPanel;