import styles from "./EditProfileForm.module.css";

function EditProfileForm({ formData, isLoading, error, handleChange, handleSubmit, onCancel }) {
    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label htmlFor="name">Display Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className={styles.textarea}
                    rows={4}
                    maxLength={160}
                />
            </div>

            {error && (
                <p className={styles.errorMessage}>{error.message ?? String(error)}</p>
            )}

            <div className={styles.actionButtons}>
                <button
                    type="button"
                    onClick={onCancel}
                    className={styles.cancelBtn}
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button type="submit" className={styles.saveBtn} disabled={isLoading}>
                    {isLoading ? "Saving…" : "Save Changes"}
                </button>
            </div>
        </form>
    );
}

export default EditProfileForm;
