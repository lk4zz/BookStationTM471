import React from 'react';
import styles from './Loading.module.css';

export const Loading = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.logoPerspectiveWrapper}>
        
        {/* THE DOORS (Symmetrical structure B|reversedB) */}
        
        {/* Left B (Regular) rotates Y negative ( French Door style ) */}
        <div className={`${styles.bDoor} ${styles.leftB}`}>
          <span>S</span>
        </div>
                <span className={styles.brandName}>BookStation</span>

        {/* Right B (Reversed) rotates Y positive */}
        <div className={`${styles.bDoor} ${styles.rightB}`}>
          <span>B</span>
        </div>

      </div>
      
      <div className={styles.brandWrapper}>
      </div>
    </div>
  );
};

export default Loading;