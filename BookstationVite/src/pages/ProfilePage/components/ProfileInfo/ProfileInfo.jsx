import Loading from "../../../../components/UI/Loading/Loading";
import infoStyles from "./ProfileInfo.module.css";
// 1. Import your new LogoutButton component
import LogoutButton from "../../../../components/UI/Buttons/LogoutButton"; // Update this path to wherever you saved it!

export function ProfileInfo({ 
    user, 
    isOwnProfile, 
    onEditClick, 
    handleToggleFollow, 
    isFollowing,
    isFollowStatusLoading, 
}) {
    const handle = user.name.toLowerCase().replace(/\s+/g, "");

    return (
        <div className={infoStyles.infoContainer}>
            <div className={infoStyles.headerRow}>
                <div className={infoStyles.textGroup}>
                    <h1 className={infoStyles.name}>{user.name}</h1>
                    <span className={infoStyles.tag}>@{handle}</span>
                </div>

                {/* 2. Check if it's their own profile */}
                {isOwnProfile ? (
                    // 3. Wrap both buttons in a div (or fragment) so React doesn't complain
                    <div className={infoStyles.actionButtons}>
                        <LogoutButton />
                        <button className={infoStyles.editButton} onClick={onEditClick}>
                            Edit Profile
                        </button>
                    </div>
                ) : isFollowStatusLoading ? (
                    <Loading />
                ) : (
                    <button
                        onClick={() => handleToggleFollow(user.id)}
                        className={infoStyles.followButton}
                    >
                        {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                )}
            </div>

            <p className={infoStyles.bio}>
                {user.bio || "This user hasn't written a bio yet."}
            </p>
        </div>
    );
}

export default ProfileInfo;