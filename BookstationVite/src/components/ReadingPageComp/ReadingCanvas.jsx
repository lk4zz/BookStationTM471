import styles from './ReadingCanvas.module.css'

function ReadingCanvas({ page, isPagesLoading, chapter }) {
    return (
        <div className={styles.paperWrapper}>
            <div className={styles.paperContainer}>
                <h1>{chapter.title} <br/></h1> 
                <p className={styles.paragraph}>
                   
                    {page.text}
                </p>

            </div>
        </div>
    )
}

export default ReadingCanvas;