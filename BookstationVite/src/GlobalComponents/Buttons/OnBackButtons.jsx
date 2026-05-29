import styles from "./OnBackButtons.module.css";

function OnBackButton({ onClick, className}) {

  // navigate back using the onclick passe parameter and passed className for postion
  return (
    <button
      type="button"
      className={`${className} ${styles.goBackBtn}`}
      onClick={onClick}
    >
      Back
    </button>
  );
}

export default OnBackButton;
