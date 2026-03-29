import styles from "./ProfileAvatar.module.css";

function ProfileAvatar({ imageUrl, name, isEditing, onImageChange }) {
    return (
        <div className={styles.avatarWrapper}>
            <img
                src={imageUrl}
                alt={`${name}'s avatar`}
                className={styles.avatarImage}
            />
            {isEditing && (
                <label className={styles.editOverlay}>
                    <span>Change</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                        className={styles.hiddenInput}
                    />
                </label>
            )}
        </div>
    );
}

export default ProfileAvatar;
