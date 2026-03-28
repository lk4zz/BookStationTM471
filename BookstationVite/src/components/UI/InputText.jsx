import styles from './InputText.module.css';
import { ArrowUpIcon } from './IconLibrary'; 

function InputText({
    value,
    onChange,
    onSubmit,
    placeholder,
    disabled = false
}) {
    // Determine if the submit action should be blocked
    const isSubmitDisabled = disabled || !value.trim();

    // Handle the enter key natively
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !isSubmitDisabled) {
            onSubmit();
        }
    };

    return (
        <div className={styles.inputWrapper}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={styles.inputField}
                disabled={disabled}
            />
            
            <button
                className={`${styles.submitBtn} ${isSubmitDisabled ? styles.disabledBtn : styles.activeBtn}`}
                onClick={onSubmit}
                disabled={isSubmitDisabled}
                aria-label="Submit"
            >
                <ArrowUpIcon className={styles.arrowIcon} />
            </button>
        </div>
    );
}

export default InputText;