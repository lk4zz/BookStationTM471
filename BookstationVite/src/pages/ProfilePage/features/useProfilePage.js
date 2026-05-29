import { useMemo, useState } from "react";
import { useUser, useCurrentUser, useEditProfile } from "../../../hooks/UserHooks/UseUser";
import { useBooksByAuthor } from "../../../hooks/bookHooks/useBookQueries";
import { resolveDocumentUrl } from "../../../utils/ImageUrl";
import { useRatingsByBookIds } from "../../../hooks/interactionHooks/useRatings";
import {useFollowStatus, useFollow, useUnfollow} from "../../../hooks/interactionHooks/useFollow"
import { useEffect } from "react";
import { checkIfGuest } from "@/utils/checkIfGuest";
import toast from "react-hot-toast";

export function useProfilePage(authorId) {


  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();
  const {
    isFollowingFromServer,
    isFollowStatusLoading,
    followStatusError,
  } = useFollowStatus(authorId);
  const isGuest = checkIfGuest();

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(isFollowingFromServer);
  }, [isFollowingFromServer]);

  const handleToggleFollow = (targetAuthorId) => {
    if (isGuest) {
      toast('Please log in to follow authors.', {
        icon: '🔒',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    if (isFollowing) {
      unfollowMutation.mutate(targetAuthorId, {
        onSuccess: () => {
          setIsFollowing(false);
        },
      });
    } else {
      followMutation.mutate(targetAuthorId, {
        onSuccess: () => {
          setIsFollowing(true);
        },
      });
    }
  };



  const { currentUser } = useCurrentUser();
  const isOwnProfile = currentUser?.id === Number(authorId);

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
    ? resolveDocumentUrl(
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
    followStatusError,
  };
}
