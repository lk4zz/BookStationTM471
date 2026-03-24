import styles from "../../pages/authPages/Auth.module.css";

export function InputField({ label, id, ...props }) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} {...props} />
    </div>
  );
}
