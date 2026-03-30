import styles from "./TextFieldsForTitles.module.css";

export function TitleInput({title, onChange}) {
    return (
        <label className={styles.label}>
            Title

            {/* this is input tag inside it i can set title using my useState */}
            <input
                className={styles.input}
                value={title}
                onChange={onChange}
                placeholder="Working title"
                maxLength={200}
                required
                // this makes it auto focused (asks to enter value when opening the modal)
                autoFocus
            />
        </label>
    )
}

export function DescriptionInput({description, onChange}) {
    return (

        <label className={styles.label}>
            Description (optional)

            {/* text area tag instead of input */}
            <textarea
                className={styles.textarea}
                value={description}
                onChange={onChange}
                placeholder="A short blurb"
                rows={5}
                maxLength={1000}
            />
        </label>

    )
}


