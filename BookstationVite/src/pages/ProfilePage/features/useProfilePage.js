import { useMemo, useState } from "react";
import { useUser, useCurrentUserId, useEditProfile } from "../../../hooks/useUser";
import { useBooksByAuthor } from "../../../hooks/useBooks";
import { resolveImageUrl } from "../../../utils/ImageUrl";
import { useViewsByBookIds } from "../../../hooks/useViews";
import { useRatingsByBookIds } from "../../../hooks/useRatings";

export function useProfilePage(authorId) {
  const { currentUserId } = useCurrentUserId();
  const isOwnProfile = currentUserId === Number(authorId);

  const [isEditing, setIsEditing] = useState(false);

  const { user, isLoading: isUserLoading, error: userError } = useUser(authorId);
  const { booksByAuthor, isBooksByAuthorLoading } = useBooksByAuthor(authorId);

  const bookIds = useMemo(
    () =>
      (booksByAuthor ?? [])
        .map((b) => b.id)
        .filter((id) => Number.isFinite(Number(id))),
    [booksByAuthor]
  );
  const { viewsByBookId } = useViewsByBookIds(bookIds);
  const { ratingsByBookId } = useRatingsByBookIds(bookIds);

  const {
    formData,
    imagePreview,
    isLoading: isUpdating,
    error: updateError,
    handleChange,
    handleImageChange,
    handleSubmit,
  } = useEditProfile(user, () => setIsEditing(false));

  const displayImage = user
    ? resolveImageUrl(
        isEditing ? (imagePreview ?? user.profileImage) : user.profileImage
      )
    : null;

  return {
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
  };
}
