import infoStyles from "./ProfileInfo.module.css";

export function ProfileInfo({ user, isOwnProfile, onEditClick }) {
    const handle = user.name.toLowerCase().replace(/\s+/g, "");

    return (
        <div className={infoStyles.infoContainer}>
            <div className={infoStyles.headerRow}>
                <div className={infoStyles.textGroup}>
                    <h1 className={infoStyles.name}>{user.name}</h1>
                    <span className={infoStyles.tag}>@{handle}</span>
                </div>

                {isOwnProfile ? (
                    <button className={infoStyles.editButton} onClick={onEditClick}>
                        Edit Profile
                    </button>
                ) : (
                    <button className={infoStyles.followButton}>Follow</button>
                )}
            </div>

            <p className={infoStyles.bio}>
                {user.bio || "This user hasn't written a bio yet."}
            </p>
        </div>
    );
}

export default ProfileInfo;