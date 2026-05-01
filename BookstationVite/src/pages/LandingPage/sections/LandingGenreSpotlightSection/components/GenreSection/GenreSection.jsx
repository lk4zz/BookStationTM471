import { renderToStaticMarkup } from "react-dom/server";
import {
  ActionGenreBg,
  ComedyGenreBg,
  FantasyGenreBg,
  HorrorGenreBg,
  MysteryGenreBg,
  RomanceGenreBg,
  ScifiGenreBg,
  ThrillerGenreBg,
  HistoricalGenreBg,
  ScifiAdvancedGenreBg,
} from "../../../../../../components/UI/Icons/IconLibrary";
import styles from "./GenreSection.module.css";
import BooksCarousel from "../../../../../../components/UI/BooksCarousel/BooksCarousel";
import { Loading } from "../../../../../../components/UI/Loading/Loading";

const buildSvgBackgroundImage = (BackgroundComponent) => {
  if (!BackgroundComponent) return undefined;
  const svgMarkup = renderToStaticMarkup(<BackgroundComponent />);
  const svgWithXmlns = svgMarkup.includes("xmlns=")
    ? svgMarkup
    : svgMarkup.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  const encodedSvg = window.btoa(unescape(encodeURIComponent(svgWithXmlns)));
  return `url("data:image/svg+xml;base64,${encodedSvg}")`;
};

const normalizeGenreType = (genreType = "") =>
  genreType.toLowerCase().replace(/[^a-z0-9]/g, "");

function GenreSection({
  genre,
  books = [],
  isBooksLoading,
  ratingsByBookId = {},
}) {
  const genreTitlePhrases = {
    Action: "Feel the adrenaline with nonstop action",
    Fantasy: "Escape into worlds beyond imagination",
    Romance: "Fall into stories of love and heartbreak",
    Scifi: "Explore the future and the unknown",
    Horror: "Face your fears in chilling tales",
    Comedy: "Laugh through lighthearted adventures",
    Mystery: "Unravel secrets and hidden truths",
  };

  const genreSubPhrases = {
    Action: "High stakes, fast pacing, and heroes who refuse to quit.",
    Fantasy: "Magic systems, epic quests, and lore you can get lost in.",
    Romance: "Emotional beats, chemistry, and relationships that matter.",
    Scifi: "Technology, speculation, and visions of what comes next.",
    Horror: "Atmosphere, tension, and the unknown lurking in the shadows.",
    Comedy: "Wit, heart, and stories that leave you smiling.",
    Mystery: "Clues, twists, and reveals worth turning the page for.",
  };

  const genreBackgroundSvgs = {
    action: ActionGenreBg,
    fantasy: FantasyGenreBg,
    romance: RomanceGenreBg,
    scifi: ScifiAdvancedGenreBg,
    horror: HorrorGenreBg,
    comedy: ComedyGenreBg,
    mystery: MysteryGenreBg,
    thriller: ThrillerGenreBg,
    historical: HistoricalGenreBg,
  };

  const phrase = genreTitlePhrases[genre.type] || genre.type;
  const subphrase = genreSubPhrases[genre.type] || `Curated picks in ${genre.type}.`;
  const normalizedGenreType = normalizeGenreType(genre.type);
  const GenreBackground = genreBackgroundSvgs[normalizedGenreType];
  const genreBackgroundImage = buildSvgBackgroundImage(GenreBackground);

  if (isBooksLoading) {
    return (
      <div className={styles.genreSection}>
        <div className={styles.intro}>
          <h2 className={styles.genreHeading}>{genre.type}</h2>
        </div>
        <Loading variant="inline" />
      </div>
    );
  }

  if (!books?.length) return null;

  return (
    <div
      className={styles.genreSection}
      style={
        genreBackgroundImage
          ? {
              backgroundImage: genreBackgroundImage,
              backgroundPosition: "center",
              backgroundRepeat: "repeat",
              backgroundSize: "cover",
            }
          : undefined
      }
    >
      <div className={styles.intro}>
        <p className={styles.genreEyebrow}>{genre.type}</p>
        <h2 className={styles.genreHeading}>{phrase}</h2>
        <p className={styles.genreSub}>{subphrase}</p>
      </div>
      <div className={styles.carouselWrap}>
        <BooksCarousel
          books={books}
          ratingsByBookId={ratingsByBookId}
        />
      </div>
    </div>
  );
}

export default GenreSection;
