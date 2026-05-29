import styles from "./ProfileAvatar.module.css";
import { User } from "lucide-react";

function ProfileAvatar({ imageUrl, name, isEditing, onImageChange }) {
    return (
        <div className={styles.avatarWrapper}>
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={name || "User Profile"}
                    className={styles.avatarImage}
                />
            ) : (
                <div className={styles.avatarFallback}>
                    <User size={40} />
                </div>
            )}
            
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