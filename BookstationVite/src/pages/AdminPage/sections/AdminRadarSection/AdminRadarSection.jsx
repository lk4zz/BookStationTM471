import { Radar } from "lucide-react";
import styles from "./AdminRadarSection.module.css";
import RadarContainer from "./components/RadarContainer";

export function AdminRadarSection({ inModal = false }) {
  return (
    <section
      className={styles.section}
      aria-labelledby={inModal ? undefined : "admin-radar-heading"}
    >
      {!inModal && (
        <div className={styles.header}>
          <h2 id="admin-radar-heading" className={styles.heading}>
            <Radar size={24} className={styles.headingIcon} /> Taste Radar
          </h2>
          <p className={styles.hint}>
            Visualize how closely catalog books match a user&apos;s taste embedding via cosine similarity.
          </p>
        </div>
      )}
      
      {inModal && (
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