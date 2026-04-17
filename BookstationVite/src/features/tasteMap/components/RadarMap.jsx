import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { projectToRadar } from "../../../../tools/radialProjection";
import styles from "./RadarMap.module.css";

const MAX_RADIUS_PX = 300;

function clamp01(n) {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export default function RadarMap({
  books = [],
  isPersonalized = false,
  embedded = false,
}) {
  const shell = embedded ? styles.wrapEmbedded : styles.wrap;
  const navigate = useNavigate();
  const [hoverId, setHoverId] = useState(null);
  const [radiusCutoff, setRadiusCutoff] = useState(1);

  const goBook = useCallback(
    (id) => navigate(`/book/${id}`),
    [navigate]
  );

  const scored = useMemo(
    () => (books ?? []).filter((b) => b != null && typeof b.similarityScore === "number"),
    [books]
  );

  const ranked = useMemo(() => {
    const sorted = [...scored].sort((a, b) => (b.similarityScore ?? 0) - (a.similarityScore ?? 0));
    const rankById = new Map(sorted.map((b, i) => [b.id, i + 1]));
    return { sorted, rankById };
  }, [scored]);

  const projected = useMemo(() => projectToRadar(ranked.sorted), [ranked.sorted]);
  const visible = useMemo(() => projected.filter((p) => p.r <= radiusCutoff), [projected, radiusCutoff]);

  const onPointerLeave = useCallback(() => setHoverId(null), []);

  if (!isPersonalized) {
    return (
      <div className={shell}>
        {!embedded && (
          <div className={styles.header}>
            <h2 className={styles.title}>Taste Radar</h2>
            <div className={styles.statusBadge}>Trending</div>
          </div>
        )}
        <p className={styles.fallback}>
          {embedded
            ? "No taste profile for this user — nothing to plot."
            : 'Personalized similarity scores are not available yet. Open "For You" again after your taste profile is set to engage the radar.'}
        </p>
      </div>
    );
  }

  if (scored.length === 0) {
    return (
      <div className={shell}>
        {!embedded && <h2 className={styles.title}>Taste Radar</h2>}
        <p className={styles.fallback}>No similarity scores detected in the current data stream.</p>
      </div>
    );
  }

  const hovered = hoverId != null ? visible.find((v) => v.id === hoverId) : null;

  return (
    <div className={shell}>
      {!embedded && (
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Taste Radar</h2>
            <p className={styles.blurb}>
              Radial distance represents absolute cosine similarity. Closer = Higher Rank.
            </p>
          </div>
        </div>
      )}

      <div className={styles.controlPanel}>
        <label className={styles.sliderLabel}>
          <div className={styles.sliderTextRow}>
            <span>Similarity Threshold</span>
            <span className={styles.sliderValue}>≥ {(1 - radiusCutoff).toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={radiusCutoff}
            onChange={(e) => setRadiusCutoff(Number(e.target.value))}
            className={styles.slider}
          />
        </label>
      </div>

      <div className={styles.radarContainer}>
        <div className={styles.svgShell}>
          <svg
            className={styles.svg}
            viewBox={`${-MAX_RADIUS_PX - 40} ${-MAX_RADIUS_PX - 40} ${(MAX_RADIUS_PX + 40) * 2} ${(MAX_RADIUS_PX + 40) * 2}`}
            role="img"
            aria-label="Taste radar: User at center, books plotted by similarity distance"
            onPointerLeave={onPointerLeave}
          >
            <defs>
              <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur1" />
                <feGaussianBlur stdDeviation="6" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="bookGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Radar Background Circle */}
            <circle cx="0" cy="0" r={MAX_RADIUS_PX} className={styles.radarBase} />

            {/* Crosshairs */}
            <line x1={-MAX_RADIUS_PX} y1="0" x2={MAX_RADIUS_PX} y2="0" className={styles.crosshair} />
            <line x1="0" y1={-MAX_RADIUS_PX} x2="0" y2={MAX_RADIUS_PX} className={styles.crosshair} />

            {/* Math coords: y up */}
            <g transform={`scale(1,-1)`}>
              {/* Concentric Rings & Labels */}
              {[0.25, 0.5, 0.75, 1].map((t, i) => {
                const r = t * MAX_RADIUS_PX;
                const simValue = (1 - t) * 100;
                return (
                  <g key={t}>
                    <circle r={r} cx={0} cy={0} fill="none" className={styles.guideRing} />
                    {/* Only show labels for inner rings to keep it clean */}
                    {i < 3 && (
                      <text
                        x={0}
                        y={r + 12}
                        textAnchor="middle"
                        className={styles.ringLabel}
                        transform="scale(1,-1)"
                      >
                        {simValue}% Match
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Data Points (Books) */}
              {visible.map((book) => {
                const cx = book.x * MAX_RADIUS_PX;
                const cy = book.y * MAX_RADIUS_PX;
                const rank = ranked.rankById.get(book.id);
                const sim = clamp01(book.similarityScore);
                const isHovered = hoverId === book.id;
                
                // Top 3 get special coloring/sizing
                const isTopTier = rank <= 3;
                const inLib = book.inLibrary === true;
                const dotR = isHovered ? 8 : isTopTier ? 6 : 4 + 2 * sim;
                const dotClass = inLib
                  ? `${styles.bookDot} ${styles.bookDotLibrary}`
                  : `${styles.bookDot}${isTopTier ? ` ${styles.bookDotTop}` : ""}`;

                return (
                  <g key={book.id} transform={`translate(${cx}, ${cy})`} className={styles.bookGroup}>
                    <circle
                      r={dotR}
                      cx={0}
                      cy={0}
                      className={dotClass}
                      style={{ opacity: isHovered ? 1 : 0.4 + 0.6 * sim }}
                      filter={isHovered || isTopTier || inLib ? "url(#bookGlow)" : ""}
                      onPointerEnter={() => setHoverId(book.id)}
                      onClick={() => goBook(book.id)}
                      role="button"
                      tabIndex={0}
                    />
                  </g>
                );
              })}

              {/* Center User Node */}
              <circle r={12} cx={0} cy={0} className={styles.userDot} filter="url(#radarGlow)" />
              <circle r={4} cx={0} cy={0} fill="#fff" />
            </g>
          </svg>

          {/* Glassmorphic Tooltip Overlay */}
          {hovered && (
            <div className={styles.tooltip} aria-live="polite">
              <div className={styles.tooltipRank}>#{ranked.rankById.get(hovered.id)} Recommended</div>
              <div className={styles.tooltipTitle}>{hovered.name ?? "Untitled"}</div>
              {hovered.inLibrary && (
                <div className={styles.tooltipLibrary}>In this user&apos;s library</div>
              )}
              <div className={styles.tooltipGrid}>
                <div className={styles.tooltipLabel}>Cosine Sim</div>
                <div className={styles.tooltipValue}>{clamp01(hovered.similarityScore).toFixed(4)}</div>
                <div className={styles.tooltipLabel}>Distance (r)</div>
                <div className={styles.tooltipValue}>{hovered.r.toFixed(4)}</div>
              </div>
              <div className={styles.tooltipAction}>Click to view book →</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}