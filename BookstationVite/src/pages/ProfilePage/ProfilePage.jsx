import { useParams } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import NavBar from "../../components/UI/NavBar/NavBar";
import { Loading } from "../../components/UI/Loading/Loading";
import ProfileBanner from "./components/ProfileBanner/ProfileBanner";
import ProfileAvatar from "./components/ProfileAvatar/ProfileAvatar";
import ProfileInfo from "./components/ProfileInfo/ProfileInfo";
import EditProfileForm from "./components/EditProfile/EditProfileForm";
import UserBooksList from "./components/UserBooksList/UserBooksList";
import { useProfilePage } from "./features/useProfilePage";

function ProfilePage() {
  const { authorId } = useParams();

  const {
    isUserLoading,
    userError,
    user,
    isOwnProfile,
    isEditing,
    setIsEditing,
    booksByAuthor,
    isBooksByAuthorLoading,
    ratingsByBookId,
    formData,
    isUpdating,
    updateError,
    handleChange,
    handleImageChange,
    handleSubmit,
    displayImage,
    handleToggleFollow,
    isFollowing,
    isFollowStatusLoading,
  } = useProfilePage(authorId);

  // --- Inline Loading State ---
  if (isUserLoading) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <main className={styles.loadingMain}>
          <Loading variant="inline" />
        </main>
      </div>
    );
  }

  // --- Inline Error & Not Found States ---
  if (userError || !user) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <p className={styles.error}>
          {userError?.message || "User not found."}
        </p>
      </div>
    );
  }

  // --- Main Profile Layout ---
  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      
      <div className={styles.pageInner}>
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
              handleToggleFollow={handleToggleFollow}
              isFollowing={isFollowing}
              isFollowStatusLoading={isFollowStatusLoading}
            />
          )}
        </div>

        <UserBooksList
          books={booksByAuthor}
          authorName={user.name}
          isLoading={isBooksByAuthorLoading}
          ratingsByBookId={ratingsByBookId}
        />
      </div>
    </div>
  );
}

export default ProfilePage;