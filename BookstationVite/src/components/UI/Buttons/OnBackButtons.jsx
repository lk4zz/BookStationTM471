import { useNavigate, useLocation } from "react-router-dom";
import styles from "./OnBackButtons.module.css";

function OnBackButton() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        const from = location.state?.from;

        if (from) {
            navigate(from);
        } else {
            navigate("/explore"); // fallback so user doesn't get lost in the void
        }
    };

    return (
        <button className={styles.goBackBtn} onClick={handleBack}>
            &larr; Back
        </button>
    );
}

export default OnBackButton;