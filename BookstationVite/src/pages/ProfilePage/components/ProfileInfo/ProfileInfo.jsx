import infoStyles from "./ProfileInfo.module.css";
import SkeletonLoading from "@/GlobalComponents/Feedback/Loading/SkeletonLoading";
import LogoutButton from "../../../../GlobalComponents/Buttons/LogoutButton"; // Update path as needed
import { Edit2, UserPlus, UserMinus } from "lucide-react";

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

                <div className={infoStyles.actionsWrapper}>
                    {isOwnProfile ? (
                        <div className={infoStyles.actionButtons}>
                            <LogoutButton />
                            <button className={infoStyles.editButton} onClick={onEditClick}>
                                <Edit2 size={16} strokeWidth={2.5} />
                                <span>Edit Profile</span>
                            </button>
                        </div>
                    ) : isFollowStatusLoading ? (
                        <div className={infoStyles.skeletonWrapper}>
                            {/* Uses the text preset but overrides width/height/radius to match the button shape */}
                            <SkeletonLoading
                                layout={[{ type: "text", height: "38px", width: "110px", borderRadius: "var(--radius-pill)" }]}
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => handleToggleFollow(user.id)}
                            className={isFollowing ? infoStyles.unfollowButton : infoStyles.followButton}
                            aria-label={isFollowing ? "Unfollow user" : "Follow user"}
                        >
                            {isFollowing ? (
                                <>
                                    <UserMinus size={16} strokeWidth={2.5} />
                                    <span>Unfollow</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus size={16} strokeWidth={2.5} />
                                    <span>Follow</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <p className={infoStyles.bio}>
                {user.bio || "This user hasn't written a bio yet."}
            </p>
        </div>
    );
}

export default ProfileInfo;