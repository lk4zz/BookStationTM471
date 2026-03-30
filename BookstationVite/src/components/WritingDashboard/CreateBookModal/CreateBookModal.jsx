import { useState } from "react";
import styles from "./CreateBookModal.module.css";
import { DescriptionInput, TitleInput } from "../../UI/TextFieldsForTitles/TextFieldsForTitles";

function CreateBookModal({ open, onClose, onCreate, isPending }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null; //if the modal not open dont show anything

  const handleSubmit = (e) => {  //when pressing creating book event
    // stops the browser from refreshing the page when you hitting create so it doesnt messeverytign
    e.preventDefault();

    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: description.trim() });
    setTitle("");
    setDescription(""); // hay empties the text feilds after
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      // clicking the dark background closes the newBookModal
      onClick={onClose}
    >
      <div
        className={styles.modal}
        // stops clicks inside the white box from accidentally triggering the onClose above
        onClick={(e) => e.stopPropagation()}
      >
        {/* title */}
        <h2 className={styles.heading}>New draft book</h2>

        {/* form */}
        <form onSubmit={handleSubmit} className={styles.form}>

          <TitleInput title={title} onChange={(e) => {
            setTitle(e.target.value);
          }} />

          {/* description input */}
          <DescriptionInput description={description} onChange={(e) => {
            setDescription(e.target.value);
          }} />

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submit}
              disabled={isPending || !title.trim()}
            >
              {isPending ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBookModal;
