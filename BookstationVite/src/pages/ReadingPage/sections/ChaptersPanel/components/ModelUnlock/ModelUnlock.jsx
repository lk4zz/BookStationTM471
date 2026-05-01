import styles from "./ModelUnlock.module.css"

function ModelUnlock({ OpenUnlock, onClose, onUnlock, chapterPrice, chapterTitle }) {

    if (!OpenUnlock) return null;

    return (
        <div className={styles.modaloverlay}>
            <div className={styles.modalcontent}>
                <h2>Chapter is Locked</h2>
                <p>Unlock {chapterTitle}  <br/><br/> And discover what happens next </p>
                

                <div className={styles.modalactions}>
                    <button className={styles.btnunlock} onClick={onUnlock}>
                        Unlock {chapterPrice}
                    </button>
                    <button className={styles.btncancel} onClick={onClose}>
                        Cancel
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ModelUnlock;
