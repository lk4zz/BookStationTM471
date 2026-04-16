import styles from "./OnBackButtons.module.css";

function OnBackButton({ onClick }) {

  return (
    <button
      type="button"
      className={styles.goBackBtn}
      onClick={onClick}
    >
      Back
    </button>
  );
}

export default OnBackButton;
