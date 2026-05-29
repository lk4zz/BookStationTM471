import { useParams } from "react-router-dom";
import styles from "./GenresPage.module.css";
import GenresGrid from "./GenresGrid";
import { useGenresPage } from "./features/useGenresPage";
import SkeletonLoading from "@/GlobalComponents/Feedback/Loading/SkeletonLoading";
import {
  Sparkles, Rocket, Heart, Search, Ghost, Flame,
  Swords, BookOpen, AlertTriangle, Compass
} from "lucide-react";
import OnBackButton from "@/GlobalComponents/Buttons/OnBackButtons";
const GENRE_CONFIG = {
  fantasy: { icon: Sparkles, desc: "Step into realms of magic, mythical creatures, and epic quests." },
  "sci-fi": { icon: Rocket, desc: "Journey through the stars, future tech, and mind-bending concepts." },
  romance: { icon: Heart, desc: "Fall in love with captivating stories of passion, devotion, and heartbreak." },
  mystery: { icon: Search, desc: "Unravel secrets, solve crimes, and follow the clues to the truth." },
  horror: { icon: Ghost, desc: "Face your deepest fears with chilling, terrifying, and macabre tales." },
  thriller: { icon: Flame, desc: "Heart-pounding suspense that will keep you on the edge of your seat." },
  action: { icon: Swords, desc: "Adrenaline-fueled adventures, epic battles, and relentless excitement." },
  default: { icon: Compass, desc: "Explore our curated collection of captivating stories in this genre." }
};

function formatGenreName(type) {
  if (!type) return "Unknown Genre";
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function GenresPage() {
  const params = useParams();
  const currentGenreType = params.type?.toLowerCase();

  const {
    isGenresLoading,
    genresError,
    genreType,
    books,
    isBooksLoading,
    booksError,
    ratingsByBookId,
  } = useGenresPage(currentGenreType);

  const isPageLoading = isGenresLoading || (genreType && isBooksLoading);

  // Extract theme config or fallback to default
  const config = GENRE_CONFIG[currentGenreType] || GENRE_CONFIG.default;
  const HeroIcon = config.icon;
  const displayName = formatGenreName(currentGenreType);

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (isPageLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.heroSkeleton}>
          <SkeletonLoading layout={[{ type: "avatar", height: "64px", width: "64px" }]} />
          <SkeletonLoading layout={[{ type: "title", width: "300px", height: "40px" }]} />
          <SkeletonLoading layout={[{ type: "text", width: "400px" }]} />
        </div>
        <div className={styles.mainContent}>
          <div className="gridContainer">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <SkeletonLoading layout={[{ type: "image", height: "260px", borderRadius: "var(--radius-md)" }]} />
                <SkeletonLoading layout={[{ type: "title", width: "80%" }, { type: "text", width: "50%" }]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR & EMPTY STATES
  // ==========================================
  if (genresError || !genreType) {
    return (
      <div className={styles.feedbackState}>
        <OnBackButton className={styles.goBackBtn} onClick={() => window.history.back()} />

        <AlertTriangle size={48} className={styles.feedbackIcon} />
        <h2 className={styles.feedbackTitle}>Oops! Something went wrong</h2>
        <p className={styles.feedbackDesc}>
          {genresError?.message || "We couldn't find the genre you're looking for."}
        </p>
      </div>
    );
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <div className={styles.pageContainer}>
      <OnBackButton className={styles.goBackBtn} onClick={() => window.history.back()} />
      {/* Dynamic Hero Header */}
      <header className={styles.heroSection}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.iconWrapper}>
            <HeroIcon size={32} strokeWidth={2} />
          </div>
          <h1 className={styles.heroTitle}>{displayName}</h1>
          <p className={styles.heroDesc}>{config.desc}</p>

          <div className={styles.statsBadge}>
            <BookOpen size={14} />
            <span>{books?.length || 0} Books Available</span>
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <main className={styles.mainContent}>
        {booksError ? (
          <div className={styles.feedbackState}>
            <AlertTriangle size={48} className={styles.feedbackIcon} />
            <p className={styles.feedbackDesc}>{booksError.message || "Failed to load books."}</p>
          </div>
        ) : (
          <GenresGrid
            books={books}
            isBooksLoading={isBooksLoading}
            booksError={booksError}
            ratingsByBookId={ratingsByBookId}
          />
        )}
      </main>

    </div>
  );
}

export default GenresPage;