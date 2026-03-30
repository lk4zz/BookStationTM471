import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProfilePage.module.css";

import { useUser, useCurrentUserId, useEditProfile } from "../../hooks/UseUser";
import { useBooksByAuthor } from "../../hooks/useBooks";
import { resolveImageUrl } from "../../utils/ImageUrl";

import ProfileBanner from "../../components/ProfilePageComp/ProfileBanner/ProfileBanner";
import ProfileAvatar from "../../components/ProfilePageComp/ProfileAvatar/ProfileAvatar";
import ProfileInfo from "../../components/ProfilePageComp/ProfileInfo/ProfileInfo";
import EditProfileForm from "../../components/ProfilePageComp/EditProfile/EditProfileForm";
import UserBooksList from "../../components/ProfilePageComp/UserBooksList/UserBooksList";

function ProfilePage() {
    const { authorId } = useParams();
    const { currentUserId } = useCurrentUserId();
    const isOwnProfile = currentUserId === Number(authorId);

    const [isEditing, setIsEditing] = useState(false);

    const { user, isLoading: isUserLoading, error: userError } = useUser(authorId);
    const { booksByAuthor, isBooksByAuthorLoading } = useBooksByAuthor(authorId);

    const {
        formData,
        imagePreview,
        isLoading: isUpdating,
        error: updateError,
        handleChange,
        handleImageChange,
        handleSubmit,
    } = useEditProfile(user, () => setIsEditing(false));

    if (isUserLoading) return <p className="loading">Loading profile…</p>;
    if (userError) return <p className={styles.error}>{userError.message}</p>;
    if (!user) return <p className={styles.error}>User not found.</p>;

    /**
     * While editing we show the blob preview (if the user picked a new image),
     * otherwise fall back to the persisted DB path.
     * Outside edit mode we always use the DB path.
     * resolveImageUrl handles blob:/http(s):/relative paths correctly in all cases.
     */
    const displayImage = resolveImageUrl(
        isEditing ? (imagePreview ?? user.profileImage) : user.profileImage
    );

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.profileCard}>
                <ProfileBanner imageUrl={displayImage} />

                <ProfileAvatar
                    imageUrl={displayImage}
                    name={user.name}
                    isEditing={isEditing}
                    onImageChange={handleImageChange}
                />

                {isEditing ? (
                    <EditProfileForm
                        formData={formData}
                        isLoading={isUpdating}
                        error={updateError}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <ProfileInfo
                        user={user}
                        isOwnProfile={isOwnProfile}
                        onEditClick={() => setIsEditing(true)}
                    />
                )}
            </div>

            <UserBooksList
                books={booksByAuthor}
                authorName={user.name}
                isLoading={isBooksByAuthorLoading}
            />
        </div>
    );
}

export default ProfilePage;
