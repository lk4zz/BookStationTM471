import BookCoverCard from "../../UI/BookCoverCard/BookCoverCard";
import { renderToStaticMarkup } from "react-dom/server";
import { useBooksByGenre } from "../../../hooks/useBooks";
import { useViewsByBookIds } from "../../../hooks/useViews";
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
} from "../../UI/Icons/IconLibrary";
import styles from "./GenreSection.module.css";
import BooksCarousel from "../../ExplorePageComp/BooksCarousel/BooksCarousel";

const buildSvgBackgroundImage = (BackgroundComponent) => {
    if (!BackgroundComponent) return undefined;
    const svgMarkup = renderToStaticMarkup(<BackgroundComponent />);
    const svgWithXmlns = svgMarkup.includes("xmlns=")
        ? svgMarkup
        : svgMarkup.replace(
            "<svg",
            '<svg xmlns="http://www.w3.org/2000/svg"'
        );
    const encodedSvg = window.btoa(unescape(encodeURIComponent(svgWithXmlns)));
    return `url("data:image/svg+xml;base64,${encodedSvg}")`;
};

const normalizeGenreType = (genreType = "") =>
    genreType.toLowerCase().replace(/[^a-z0-9]/g, "");

function GenreSection({ genre }) {
    const { books } = useBooksByGenre(genre.id);
    const { viewsByBookId } = useViewsByBookIds(books.map((bookItem) => bookItem.id));

    if (!books) return <p>Loading...</p>;
    if (books.length === 0) return null;

    const genreTitlePhrases = {
        Action: "Feel the adrenaline with nonstop action",
        Fantasy: "Escape into worlds beyond imagination",
        Romance: "Fall into stories of love and heartbreak",
        Scifi: "Explore the future and the unknown",
        Horror: "Face your fears in chilling tales",
        Comedy: "Laugh through lighthearted adventures",
        Mystery: "Unravel secrets and hidden truths",
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
    const normalizedGenreType = normalizeGenreType(genre.type);
    const GenreBackground = genreBackgroundSvgs[normalizedGenreType];
    const genreBackgroundImage = buildSvgBackgroundImage(GenreBackground);

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
            <p className="headers">{phrase}</p>
            <BooksCarousel
                books={books}
                viewsByBookId={viewsByBookId}
            />
        </div>
    )
}

export default GenreSection;