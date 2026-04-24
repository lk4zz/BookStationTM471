import { useParams } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import NavBar from "../../components/UI/NavBar/NavBar";
import ProfileLoadingSection from "./sections/ProfileLoadingSection/ProfileLoadingSection";
import ProfileMessageSection from "./sections/ProfileMessageSection/ProfileMessageSection";
import ProfileMainSection from "./sections/ProfileMainSection/ProfileMainSection";
import { useProfilePage } from "./features/useProfilePage";
import { useNavigate } from "react-router-dom";

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
    viewsByBookId,
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
  const navigate = useNavigate();

  if (isUserLoading) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <ProfileLoadingSection />
      </div>
    );
  }

  if (userError) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <ProfileMessageSection message={userError.message} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <ProfileMessageSection message="User not found." />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <ProfileMainSection
        user={user}
        isOwnProfile={isOwnProfile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        displayImage={displayImage}
        formData={formData}
        isUpdating={isUpdating}
        updateError={updateError}
        handleChange={handleChange}
        handleImageChange={handleImageChange}
        handleSubmit={handleSubmit}
        booksByAuthor={booksByAuthor}
        isBooksByAuthorLoading={isBooksByAuthorLoading}
        viewsByBookId={viewsByBookId}
        ratingsByBookId={ratingsByBookId}
        navigate={navigate}
        handleToggleFollow={handleToggleFollow}
        isFollowing={isFollowing}
        isFollowStatusLoading={isFollowStatusLoading}

      />
    </div>
  );
}

export default ProfilePage;
