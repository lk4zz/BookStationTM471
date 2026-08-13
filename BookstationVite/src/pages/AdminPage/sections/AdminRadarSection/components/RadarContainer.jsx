import { useState } from "react";
import { useUserRadar } from "../../../../../hooks/adminHooks/useAdminQueries"; // Adjust path if needed
import { Loading } from "../../../../../GlobalComponents/Feedback/Loading/Loading";
import RadarMap from "./RadarMap";
import { Search, Target, AlertTriangle } from "lucide-react";
import styles from "./RadarContainer.module.css";

export default function RadarContainer() {
  const [input, setInput] = useState("");
  const [appliedId, setAppliedId] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Validate the ID
  const enabled =
    appliedId != null &&
    Number.isFinite(Number(appliedId)) &&
    Number(appliedId) > 0;

  // Utilize the custom hook
  const { 
    books, 
    isPersonalized, 
    isLoading, 
    isFetching, 
    error, 
    refetch 
  } = useUserRadar(appliedId, enabled);

  // Handle generating/refreshing the radar
  const generate = (e) => {
    e?.preventDefault();
    setHasSubmitted(true);
    const n = parseInt(String(input).trim(), 10);
    const newId = Number.isFinite(n) && n > 0 ? n : null;

    if (newId === appliedId && newId !== null) {
      // If the ID is the exact same, bypass the cache and force a fresh scan
      refetch();
    } else {
      // Otherwise, set the new ID (React Query fetches automatically)
      setAppliedId(newId);
    }
  };

  // We show the loading state on initial load (isLoading) AND manual refetches (isFetching)
  const showLoading = enabled && (isLoading);

  return (
    <div className={styles.container}>
      <form className={styles.controls} onSubmit={generate}>
        <div className={styles.inputGroup}>
          <Search size={18} className={styles.inputIcon} />
          <input
            id="radar-user-id"
            className={styles.input}
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter User ID (e.g. 1)"
            autoComplete="off"
            min="1"
          />
        </div>
        <button type="submit" className={styles.button} disabled={showLoading}>
          <Target size={16} /> Scan Grid
        </button>
      </form>

      {/* Invalid Input State */}
      {hasSubmitted && appliedId == null && (
        <div className={styles.statusMessage} role="status">
          <AlertTriangle size={16} className={styles.warningIcon} />
          Please enter a valid User ID greater than zero.
        </div>
      )}

      {/* Loading & Scanning State */}
      {showLoading && (
        <div className={styles.loadingState}>
          <Loading variant="inline" />
          <p className={styles.loadingText}>Calibrating radar and mapping taste vectors...</p>
        </div>
      )}

      {/* Error State (Only triggers on actual API failures, not empty taste) */}
      {enabled && error && !showLoading && (
        <div className={styles.errorState} role="alert">
          <AlertTriangle size={24} className={styles.errorIcon} />
          <p>{error.message || "Failed to fetch radar data from the mainframe."}</p>
        </div>
      )}

      {/* Success State */}
      {enabled && !showLoading && !error && (
        <div className={styles.radarBody}>
          <RadarMap books={books} isPersonalized={isPersonalized} />
        </div>
      )}
    </div>
  );
}