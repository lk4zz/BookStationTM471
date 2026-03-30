import styles from './IsGuestLibrary.module.css'
import { useNavigate } from "react-router-dom";

function IsGuestLibrary({ suggestion, title, body, path }) {
    const navigate = useNavigate();
    return (
        <main className={styles.centeredContent}>
            <h2 className={styles.messageTitle}>{title}</h2>
            <p className={styles.messageBody}>{body}</p>
            <button onClick={() => navigate( path )} className={styles.primaryButton}>
                {suggestion}
            </button>
        </main>
    )
}

export default IsGuestLibrary;