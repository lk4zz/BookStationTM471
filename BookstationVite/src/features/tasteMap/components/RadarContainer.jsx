import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserRadar } from "../../../api/radar";
import { Loading } from "../../../components/UI/Loading/Loading";
import RadarMap from "./RadarMap";
import styles from "./RadarContainer.module.css";

export default function RadarContainer() {
  const [input, setInput] = useState("");
  const [appliedId, setAppliedId] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const enabled =
    appliedId != null &&
    Number.isFinite(Number(appliedId)) &&
    Number(appliedId) > 0;

  const { data, isLoading, error } = useQuery({
    queryKey: ["radar", appliedId],
    queryFn: () => getUserRadar(Number(appliedId)),
    enabled,
  });

  const generate = () => {
    setHasSubmitted(true);
    const n = parseInt(String(input).trim(), 10);
    setAppliedId(Number.isFinite(n) && n > 0 ? n : null);
  };

  const books = data?.books ?? [];
  const isPersonalized = data?.isPersonalized ?? false;

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Taste radar</h2>
      <p className={styles.cardHint}>
        Enter any user ID and generate (testing build — no auth on this endpoint).
      </p>

      <label className={styles.label} htmlFor="radar-user-id">
        User ID
      </label>
      <textarea
        id="radar-user-id"
        className={styles.textarea}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={2}
        placeholder="e.g. 1"
        autoComplete="off"
      />
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={generate}>
          Generate radar
        </button>
      </div>

      {hasSubmitted && appliedId == null && (
        <p className={styles.invalid} role="status">
          Enter a whole number greater than zero.
        </p>
      )}

      {enabled && isLoading && (
        <div className={styles.inlineState}>
          <Loading variant="inline" />
          <p className={styles.inlineText}>Scanning catalog… calibrating radar…</p>
        </div>
      )}

      {enabled && error && (
        <p className={styles.error} role="alert">
          {error.message || "Failed to fetch radar data"}
        </p>
      )}

      {enabled && !isLoading && !error && (
        <div className={styles.radarBody}>
          <RadarMap books={books} isPersonalized={isPersonalized} embedded />
        </div>
      )}
    </div>
  );
}
