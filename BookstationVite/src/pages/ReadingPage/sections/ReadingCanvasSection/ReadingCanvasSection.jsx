import { useState } from "react";
import ReadingCanvas from "./components/ReadingCanvas/ReadingCanvas";
import { Loading } from "../../../../GlobalComponents/Feedback/Loading/Loading";
import styles from "./ReadingCanvasSection.module.css";

function ReadingCanvasSection({
  chapter,
  isContentLoading,
  firstPage,
  isPagesLoading,
}) {
  const [isLightOn, setIsLightOn] = useState(false);
  const [isWarmLight, setIsWarmLight] = useState(false);

  return (
    <section className={styles.middleSection}>
      {isContentLoading ? (
        <div className={styles.canvasContainer}>
          <div className={styles.canvasPad}>
            <Loading variant="inline" />
          </div>
        </div>
      ) : (
        <>
          {/* Light Bar sits at the top, out of the scroll flow */}
          <div className={styles.lightBar}>
            
            {/* Title */}
            <div className={styles.barTitle}>
              Book Light
            </div>

            {/* Controls */}
            <div className={styles.lightControls}>
              
              {/* Toggle Warm Light */}
              <button
                className={`${styles.lightButton} ${isWarmLight ? styles.activeWarm : ""}`}
                onClick={() => setIsWarmLight((prev) => !prev)}
                disabled={!isLightOn}
                aria-label={isWarmLight ? "Switch to standard light" : "Switch to warm light"}
                title={isWarmLight ? "Switch to standard light" : "Switch to warm light"}
              >
                <svg
                  className={isWarmLight ? styles.iconSpin : styles.iconStatic}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </button>

              {/* Main Power Button */}
              <button
                className={`${styles.lightButton} ${isLightOn ? styles.active : ""}`}
                onClick={() => setIsLightOn((prev) => !prev)}
                aria-label={isLightOn ? "Turn off reading light" : "Turn on reading light"}
                title={isLightOn ? "Turn off light" : "Turn on light"}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M9 17h6v4H9z" />
                  <path d="M12 21v-4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Light Effect */}
          {isLightOn && (
            <div 
              className={`${styles.lightEffect} ${isWarmLight ? styles.lightEffectWarm : ""}`} 
            />
          )}

          {/* Canvas Container */}
          <div className={styles.canvasContainer}>
            <div className={styles.canvasWrapper}>
              <ReadingCanvas
                key={firstPage.id}
                page={firstPage}
                chapter={chapter}
                isPagesLoading={isPagesLoading}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default ReadingCanvasSection;