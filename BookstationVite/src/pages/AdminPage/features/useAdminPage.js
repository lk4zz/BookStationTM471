import { useState, useMemo } from "react";
import { userMatchesSearch, bookMatchesSearch } from "../../../utils/fuzzyNameSearch";
import { useAllUsers, useAllBooks, useReviewQueue } from "../../../hooks/adminHooks/useAdminQueries";
import { useCurrentUser } from "../../../hooks/UserHooks/UseUser";
import {
  useBanUser, 
  useDeleteBook, 
  useChangeUserRole,
  useFlagBookAndNotify, 
  useUnflagBook,
  useSendFeedbackAgain,
  useReviewApplication
} from "../../../hooks/adminHooks/useAdminMutations";

export const ADMIN_MAX_VISIBLE_ROWS = 2000;

export const useAdminPage = () => {
  const { currentUser, isCurrentUserLoading } = useCurrentUser();

  // raw data AND the query states
  const { usersRaw, isLoading: isUsersLoading, error: usersError } = useAllUsers();
  const { booksRaw, isLoading: isBooksLoading, error: booksError } = useAllBooks();
  const { reviewQueue, isLoading: isReviewQueueLoading, error: reviewQueueError } = useReviewQueue();

  // mutation hooks
  const banUserMutation = useBanUser();
  const deleteBookMutation = useDeleteBook();
  const changeUserRoleMutation = useChangeUserRole();
  const flagBookAndNotify = useFlagBookAndNotify();
  const unflagBook = useUnflagBook();
  const sendFeedbackAgain = useSendFeedbackAgain();
  const reviewApplication = useReviewApplication();

  // STATES
  const [activeTab, setActiveTab] = useState("users");
  const [userSearch, setUserSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  // FUZZY SEARCH OF USERS
  const filteredUsers = useMemo(() => {
    const list = usersRaw.filter((u) => userMatchesSearch(u, userSearch));
    if (list.length <= ADMIN_MAX_VISIBLE_ROWS) return list;
    return list.slice(0, ADMIN_MAX_VISIBLE_ROWS);
  }, [usersRaw, userSearch]);

  // FUZZY SEARCH OF BOOKS
  const filteredBooks = useMemo(() => {
    const list = booksRaw.filter((b) => bookMatchesSearch(b, bookSearch));
    if (list.length <= ADMIN_MAX_VISIBLE_ROWS) return list;
    return list.slice(0, ADMIN_MAX_VISIBLE_ROWS);
  }, [booksRaw, bookSearch]);

  const userListTruncated = useMemo(() => {
    return usersRaw.filter((u) => userMatchesSearch(u, userSearch)).length > ADMIN_MAX_VISIBLE_ROWS;
  }, [usersRaw, userSearch]);

  const bookListTruncated = useMemo(() => {
    return booksRaw.filter((b) => bookMatchesSearch(b, bookSearch)).length > ADMIN_MAX_VISIBLE_ROWS;
  }, [booksRaw, bookSearch]);

  return {
    usersData: usersRaw,
    filteredUsers,
    userSearch,
    setUserSearch,
    userListTruncated,

    booksData: booksRaw,
    filteredBooks,
    bookSearch,
    setBookSearch,
    bookListTruncated,

    isUsersLoading,
    usersError,

    isBooksLoading,
    booksError: booksError?.response?.status === 404 ? null : booksError,

    reviewQueue,
    isReviewQueueLoading,
    reviewQueueError,

    banUser: banUserMutation.mutate,
    isBanning: banUserMutation.isPending,
    banError: banUserMutation.error,

    changeUserRole: changeUserRoleMutation.mutate,
    isChangingRole: changeUserRoleMutation.isPending,
    changeRoleError: changeUserRoleMutation.error,

    deleteBook: deleteBookMutation.mutate,
    isDeletingBook: deleteBookMutation.isPending,
    deleteBookError: deleteBookMutation.error,

    flagBook: flagBookAndNotify.mutate,
    isFlaggingBook: flagBookAndNotify.isPending,
    flagBookError: flagBookAndNotify.error,

    unflagBook: unflagBook.mutate,
    isUnflaggingBooks: unflagBook.isPending,
    unflagBookError: unflagBook.error,

    sendFeedbackAgain: sendFeedbackAgain.mutate,
    isSendingFeedback: sendFeedbackAgain.isPending,

    reviewApplication: reviewApplication.mutate,
    isReviewingApplication: reviewApplication.isPending,

    activeTab,
    setActiveTab,

    catalogBookCount: booksRaw.length,
    regularUserCount: usersRaw.length,

    currentUserRoleId: currentUser?.roleId,
    isCurrentUserLoading,
  };
};