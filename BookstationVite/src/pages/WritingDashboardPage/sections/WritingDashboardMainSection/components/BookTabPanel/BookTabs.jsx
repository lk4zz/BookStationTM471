import styles from "./BookTabs.module.css";

const TABS = [
  { key: "DRAFTS",    label: "Drafts"    },
  { key: "ONGOING",   label: "On Going"  },
  { key: "COMPLETED", label: "Completed" },
];

function BookTabs({ handleActiveTab, activeTab }) {
  return (
    <div className={styles.tabBar}>
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          className={`${styles.tab} ${activeTab === key ? styles.tabActive : styles.tabInactive}`}
          onClick={() => handleActiveTab(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default BookTabs;