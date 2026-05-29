import styles from "./AdminTabs.module.css";

export const AdminTabs = ({ activeTab, setActiveTab, reviewQueue }) => {
  return (
    <div className={styles.tabRow} role="tablist" aria-label="Admin areas">
      <button
        type="button"
        className={styles.tabBtn}
        role="tab"
        aria-selected={activeTab === "users"}
        onClick={() => setActiveTab("users")}
      >
        Users
      </button>
      <button
        type="button"
        className={styles.tabBtn}
        role="tab"
        aria-selected={activeTab === "books"}
        onClick={() => setActiveTab("books")}
      >
        Books Catalog
      </button>
      <button
        type="button"
        className={styles.tabBtn}
        role="tab"
        aria-selected={activeTab === "reviews"}
        onClick={() => setActiveTab("reviews")}
      >
        Review Queue {reviewQueue?.length > 0 && `(${reviewQueue.length})`}
      </button>
      <button
        type="button"
        className={styles.tabBtn}
        role="tab"
        aria-selected={activeTab === "applications"}
        onClick={() => setActiveTab("applications")}
      >
        Author Requests
      </button>
      <button
        type="button"
        className={styles.tabBtn}
        role="tab"
        aria-selected={activeTab === "radar"}
        onClick={() => setActiveTab("radar")}
      >
        Taste Radar
      </button>
    </div>
  );
};
