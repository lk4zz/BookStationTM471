import styles from "./ChapterSection.module.css";
import ChapterCards from "../../../../components/UI/ChapterCards/ChapterCards";
import Loading from "../../../../components/UI/Loading/Loading";


function ChapterSection({ chapters, isChapterLoading, publishedChapters }) {
    return (
        <div className={styles.chaptercolumn}>
            <h3 className={styles.sectionTitle}>Chapters</h3>
            <div className={styles.scrollList}>
                {isChapterLoading ? (
                    <Loading />
                ) : chapters?.length > 0 && publishedChapters?.length > 0 ? (
                    chapters
                        .map((chapter) => (
                            <ChapterCards key={chapter.id} chapter={chapter} className={styles.chapterCard}/>
                        ))
                ) : (
                    <p className={styles.emptyState}>No chapters available.</p>
                )}
            </div>
        </div>
    )
}

export default ChapterSection;