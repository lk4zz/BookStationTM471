import OnBackButton from "../../../../components/UI/Buttons/OnBackButtons";
import ProfileBanner from "./components/ProfileBanner/ProfileBanner";
import ProfileAvatar from "./components/ProfileAvatar/ProfileAvatar";
import ProfileInfo from "./components/ProfileInfo/ProfileInfo";
import EditProfileForm from "./components/EditProfile/EditProfileForm";
import UserBooksList from "./components/UserBooksList/UserBooksList";
import styles from "./ProfileMainSection.module.css";

function ProfileMainSection({
  user,
  isOwnProfile,
  isEditing,
  setIsEditing,
  displayImage,
  formData,
  isUpdating,
  updateError,
  handleChange,
  handleImageChange,
  handleSubmit,
  booksByAuthor,
  isBooksByAuthorLoading,
}) {
  return (
    <div className={styles.pageInner}>
      <header className={styles.pageHeader}>
        <OnBackButton fallbackPath="/explore" />
      </header>

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

export default ProfileMainSection;
