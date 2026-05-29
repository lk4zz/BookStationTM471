import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { projectToRadar } from "../../../../../../tools/radialProjection";
import { Compass, BookMarked, Crosshair } from "lucide-react";
import styles from "./RadarMap.module.css";

const MAX_RADIUS_PX = 300;

function clamp01(n) {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export default function RadarMap({ books = [], isPersonalized = false }) {
  const navigate = useNavigate();
  const [hoverId, setHoverId] = useState(null);
  const [radiusCutoff, setRadiusCutoff] = useState(1);

  const goBook = useCallback((id) => navigate(`/book/${id}`), [navigate]);

  const scored = useMemo(
    () => (books ?? []).filter((b) => b != null && typeof b.similarityScore === "number"),
    [books]
  );

  const ranked = useMemo(() => {
    const sorted = [...scored].sort((a, b) => (b.similarityScore ?? 0) - (a.similarityScore ?? 0));
    const rankById = new Map(sorted.map((b, i) => [b.id, i + 1]));
    return { sorted, rankById };
  }, [scored]);

  // FIX: Merge original book data back into the radar coordinates 
  // so we don't lose properties like `inLibrary` and `name`
  const projected = useMemo(() => {
    const radarData = projectToRadar(ranked.sorted);
    const originalBooksMap = new Map(ranked.sorted.map((b) => [b.id, b]));
    
    return radarData.map((p) => ({
      ...originalBooksMap.get(p.id), // Restore name, inLibrary, etc.
      ...p // Overwrite with x, y, r from the projection
    }));
  }, [ranked.sorted]);

  const visible = useMemo(() => projected.filter((p) => p.r <= radiusCutoff), [projected, radiusCutoff]);

  const onPointerLeave = useCallback(() => setHoverId(null), []);

  if (!isPersonalized) {
    return (
      <div className={styles.emptyState}>
        <Compass size={40} className={styles.emptyIcon} />
        <p>No taste profile calculated for this user yet.</p>
      </div>
    );
  }

  if (scored.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Crosshair size={40} className={styles.emptyIcon} />
        <p>No similarity scores detected in the current data stream.</p>
      </div>
    );
  }

  const hovered = hoverId != null ? visible.find((v) => v.id === hoverId) : null;

  return (
    <div className={styles.radarWrapper}>
      
      {/* Premium Glass Slider */}
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

      <div className={styles.svgContainer}>
        <svg
          className={styles.svg}
          viewBox={`${-MAX_RADIUS_PX - 40} ${-MAX_RADIUS_PX - 40} ${(MAX_RADIUS_PX + 40) * 2} ${(MAX_RADIUS_PX + 40) * 2}`}
          role="img"
          aria-label="Taste radar: User at center, books plotted by similarity distance"
          onPointerLeave={onPointerLeave}
        >
          <defs>
            <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="bookGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Deep Space Background Grid */}
          <circle cx="0" cy="0" r={MAX_RADIUS_PX} className={styles.radarBase} />
          <line x1={-MAX_RADIUS_PX} y1="0" x2={MAX_RADIUS_PX} y2="0" className={styles.crosshair} />
          <line x1="0" y1={-MAX_RADIUS_PX} x2="0" y2={MAX_RADIUS_PX} className={styles.crosshair} />

          <g transform={`scale(1,-1)`}>
            {[0.25, 0.5, 0.75, 1].map((t, i) => {
              const r = t * MAX_RADIUS_PX;
              const simValue = (1 - t) * 100;
              return (
                <g key={t}>
                  <circle r={r} cx={0} cy={0} fill="none" className={styles.guideRing} />
                  {i < 3 && (
                    <text
                      x={0}
                      y={r + 14}
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

            {visible.map((book) => {
              const cx = book.x * MAX_RADIUS_PX;
              const cy = book.y * MAX_RADIUS_PX;
              const rank = ranked.rankById.get(book.id);
              const sim = clamp01(book.similarityScore);
              const isHovered = hoverId === book.id;

              const isTopTier = rank <= 3;
              const inLib = book.inLibrary === true;
              const dotR = isHovered ? 9 : isTopTier ? 7 : 4 + 2 * sim;
              
              let dotClass = styles.bookDot;
              if (inLib) dotClass += ` ${styles.bookDotLibrary}`;
              else if (isTopTier) dotClass += ` ${styles.bookDotTop}`;

              return (
                <g key={book.id} transform={`translate(${cx}, ${cy})`} className={styles.bookGroup}>
                  <circle
                    r={dotR}
                    cx={0}
                    cy={0}
                    className={dotClass}
                    style={{ opacity: isHovered ? 1 : 0.5 + 0.5 * sim }}
                    filter={isHovered || isTopTier || inLib ? "url(#bookGlow)" : ""}
                    onPointerEnter={() => setHoverId(book.id)}
                    onClick={() => goBook(book.id)}
                    role="button"
                    tabIndex={0}
                  />
                </g>
              );
            })}

            {/* Target User Center point */}
            <circle r={14} cx={0} cy={0} className={styles.userDotGlow} filter="url(#radarGlow)" />
            <circle r={6} cx={0} cy={0} className={styles.userDotCore} />
          </g>
        </svg>

        {/* Glassmorphic Tooltip */}
        {hovered && (
          <div className={styles.tooltip} aria-live="polite">
            <div className={styles.tooltipHeader}>
              <span className={styles.tooltipRank}>#{ranked.rankById.get(hovered.id)} Match</span>
            </div>
            
            <h4 className={styles.tooltipTitle}>{hovered.name ?? "Untitled"}</h4>
            
            {hovered.inLibrary && (
              <div className={styles.tooltipLibrary}>
                <BookMarked size={12} /> In user's library
              </div>
            )}
            
            <div className={styles.tooltipGrid}>
              <span className={styles.tooltipLabel}>Cosine Sim</span>
              <span className={styles.tooltipValue}>{clamp01(hovered.similarityScore).toFixed(4)}</span>
              <span className={styles.tooltipLabel}>Distance (r)</span>
              <span className={styles.tooltipValue}>{hovered.r.toFixed(4)}</span>
            </div>
            
            <div className={styles.tooltipAction}>Click to inspect book &rarr;</div>
          </div>
        )}
      </div>
    </div>
  );
}