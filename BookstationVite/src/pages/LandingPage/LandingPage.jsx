import styles from "./LandingPage.module.css";
import LandingNavSection from "./sections/LandingNavSection/LandingNavSection";
import LandingHeroSection from "./sections/LandingHeroSection/LandingHeroSection";
import LandingFeaturesSection from "./sections/LandingFeaturesSection/LandingFeaturesSection";
import LandingTrendingSection from "./sections/LandingTrendingSection/LandingTrendingSection";
import LandingGenreSpotlightSection from "./sections/LandingGenreSpotlightSection/LandingGenreSpotlightSection";
import LandingGenrePickSection from "./sections/LandingGenrePickSection/LandingGenrePickSection";
import LandingFooterSection from "./sections/LandingFooterSection/LandingFooterSection";
import { useLandingPage } from "./features/useLandingPage";

function LandingPage() {
  const {
    isTrendingLoading,
    trendingError,
    isGenresLoading,
    genresError,
    trendingBooks,
    genres,
    randomGenre,
  } = useLandingPage();

  if (isTrendingLoading) return <p className="loading"> Loading...</p>;
  if (trendingError) return <p className="loading"> {trendingError.message}</p>;
  if (isGenresLoading) return <p>loading..</p>;
  if (genresError) return <p>{genresError.message}</p>;

  return (
    <div className={styles.pageWrapper}>
      <LandingNavSection />

      <LandingHeroSection />

      <LandingFeaturesSection />

      <LandingTrendingSection
        trendingBooks={trendingBooks}
        isTrendingLoading={isTrendingLoading}
        trendingError={trendingError}
      />

      <LandingGenreSpotlightSection randomGenre={randomGenre} />

      <LandingGenrePickSection genres={genres} />

      <LandingFooterSection />
    </div>
  );
}

export default LandingPage;
