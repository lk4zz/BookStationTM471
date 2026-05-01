import { useState } from "react";
import toast from "react-hot-toast";
import styles from "./WritingAiPanel.module.css";
import InputText from "../InputFields/InputText";
import { useAIPrompting } from "../../../hooks/features/useAIPrompting";
import AIChat from "./AIChat";
import { usePurchaseAIPass } from "../../../hooks/useWallet";

// Local Modal Component (Will be moved to globals later)
function AIUnlockModal({ isOpen, onClose, onUnlock, isPending }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modaloverlay}>
            <div className={styles.modalcontent}>
                <h2>AI Assistant Locked</h2>
                <p>Unlock unlimited AI access for 3 hours. <br/><br/> Cost: 100 Coins</p>
                
                <div className={styles.modalactions}>
                    <button 
                        className={styles.btnunlock} 
                        onClick={onUnlock}
                        disabled={isPending}
                    >
                        {isPending ? "Processing..." : "Unlock 100"}
                    </button>
                    <button 
                        className={styles.btncancel} 
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

function WritingAiPanel({ chapterId, currentUser }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { mutate: buyAIPass, isPending } = usePurchaseAIPass();

    const {
        promptInput,
        handlePromptInput,
        handleSendPrompt,
        messages,
    } = useAIPrompting(chapterId);

    // The binary check
    const hasAIAccess = currentUser?.aiAccessExpires && new Date(currentUser.aiAccessExpires) > new Date();

    const handlePurchase = () => {
        buyAIPass(undefined, {
            onSuccess: () => {
                toast.success("AI Pass unlocked for 3 hours! ✨");
                setIsModalOpen(false);
            },
            onError: (error) => {
                const errMsg = error.response?.data?.error || error.response?.data?.message || "Not enough coins.";
                toast.error(errMsg);
            }
        });
    };

    return (
        <aside className={styles.panel}>
            <div>
                <h2 className={styles.title}>Writing assistant</h2>
            </div>
            
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

            <AIUnlockModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUnlock={handlePurchase}
                isPending={isPending}
            />
        </aside>
    );
}

export default WritingAiPanel;