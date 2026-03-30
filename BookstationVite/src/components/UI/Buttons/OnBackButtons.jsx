import { useNavigate } from "react-router-dom"
import styles from "./OnBackButtons.module.css"

function OnBackButton() {
    const navigate = useNavigate();
    return (
        <button className={styles.goBackBtn} onClick={() => navigate(-1)}>
            &larr; Go Back
        </button>
    )
}

export default OnBackButton;