import { useState } from "react";
import styles from "./Explore.module.css";
import NavBar from "../../GlobalComponents/Layout/NavBar/NavBar";
import TrendingSection from "./sections/TrendingSection/TrendingSection";
import ExploreContent from "./sections/ExploreContent/ExploreContent";

function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className={styles.pageShell}>
      <NavBar onSearch={setSearchQuery} />
      <main className={styles.pageScrollArea}>
        {!isSearching && (
          <section>
            <TrendingSection />
          </section>
        )}

        <section>
          <ExploreContent searchQuery={searchQuery} />
        </section>
      </main>
    </div>
  );
}

export default Explore;