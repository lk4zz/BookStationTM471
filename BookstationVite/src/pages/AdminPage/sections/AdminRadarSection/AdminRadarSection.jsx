import styles from "./AdminRadarSection.module.css";
import RadarContainer from "./components/RadarContainer";

export function AdminRadarSection({ inModal = false }) {
  return (
    <section
      className={styles.section}
      aria-labelledby={inModal ? undefined : "admin-radar-heading"}
    >
      {!inModal ? (
        <>
          <h2 id="admin-radar-heading" className={styles.heading}>
            Taste radar
          </h2>
          <p className={styles.hint}>
            Visualize how closely catalog books match a user&apos;s taste embedding (cosine
            similarity).
          </p>
        </>
      ) : (
        <p className={styles.hint}>
          Enter a user ID to plot similarity scores against the catalog.
        </p>
      )}
      <div className={styles.radarWrapper}>
        <RadarContainer />
      </div>
    </section>
  );
}