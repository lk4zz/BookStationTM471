import styles from "./PageHeader.module.css";
 
function PageHeader({ title, subtitle, onNewBook }) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <button type="button" className={styles.primaryBtn} onClick={onNewBook}>
        New book
      </button>
    </header>
  );
}
 
export default PageHeader;