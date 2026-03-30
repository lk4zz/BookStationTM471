import styles from './ReadingCanvas.module.css'

function ReadingCanvas({ page, isPagesLoading, chapter }) {
    return (
        <div className={styles.paperWrapper}>
            <div className={styles.paperContainer}>
                <h1>{chapter.title} <br/></h1> 
                <div
                    className={styles.htmlBody}
                    dangerouslySetInnerHTML={{ __html: page.text }}
                />

            </div>
        </div>
    )
}

export default ReadingCanvas;